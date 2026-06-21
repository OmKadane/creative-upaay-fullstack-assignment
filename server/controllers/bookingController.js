const mongoose = require('mongoose');
const Showtime = require('../models/Showtime');
const Reservation = require('../models/Reservation');
const { acquireLocks, releaseLocks } = require('../utils/lockManager');

const BOOKING_FEE_PERCENT = 0.05; // 5% booking fee
const LOCK_TTL_MS = 30 * 1000;

// @desc    Reserve seats (ACID transaction with locking)
// @route   POST /api/bookings/reserve
// @access  Private
const reserveSeats = async (req, res) => {
  const { showtimeId, seatIds, paymentMethod = 'card' } = req.body;
  const userId = req.user._id.toString();

  if (!showtimeId || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
    return res.status(400).json({ success: false, message: 'showtimeId and seatIds are required.' });
  }

  if (seatIds.length > 6) {
    return res.status(400).json({ success: false, message: 'Cannot reserve more than 6 seats at once.' });
  }

  // Step 1: Acquire in-memory distributed locks
  const { acquired, conflictingSeats } = acquireLocks(showtimeId, seatIds, userId);

  if (!acquired) {
    return res.status(409).json({
      success: false,
      message: `Seats ${conflictingSeats.join(', ')} are being reserved by another user. Please try again shortly.`,
      conflictingSeats,
    });
  }

  // Step 2: MongoDB ACID transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Lock showtime document
    const showtime = await Showtime.findById(showtimeId).session(session);

    if (!showtime) {
      await session.abortTransaction();
      session.endSession();
      releaseLocks(showtimeId, seatIds, userId);
      return res.status(404).json({ success: false, message: 'Showtime not found.' });
    }

    // Validate seat availability in DB
    const now = new Date();
    const requestedSeats = [];
    const unavailableSeats = [];

    for (const seatId of seatIds) {
      const seat = showtime.seats.find((s) => s.seatId === seatId);

      if (!seat) {
        unavailableSeats.push(`${seatId} (not found)`);
        continue;
      }

      // Expire stale locks
      if (seat.status === 'locked' && seat.lockExpiry && seat.lockExpiry < now) {
        seat.status = 'available';
        seat.lockedBy = null;
        seat.lockedAt = null;
        seat.lockExpiry = null;
      }

      if (seat.status !== 'available') {
        unavailableSeats.push(`${seatId} (${seat.status})`);
      } else {
        requestedSeats.push(seat);
      }
    }

    if (unavailableSeats.length > 0) {
      await session.abortTransaction();
      session.endSession();
      releaseLocks(showtimeId, seatIds, userId);
      return res.status(409).json({
        success: false,
        message: `Some seats are no longer available: ${unavailableSeats.join(', ')}`,
        unavailableSeats,
      });
    }

    // Step 3: Mark seats as occupied
    for (const seat of requestedSeats) {
      seat.status = 'occupied';
      seat.lockedBy = userId;
      seat.lockedAt = now;
      seat.lockExpiry = null;
    }
    showtime.availableSeats -= requestedSeats.length;
    await showtime.save({ session });

    // Step 4: Simulate payment (always succeeds in demo; can inject failure flag)
    const paymentSuccess = req.body.simulateFailure !== true;

    if (!paymentSuccess) {
      // Rollback: Release seats
      for (const seat of requestedSeats) {
        seat.status = 'available';
        seat.lockedBy = null;
        seat.lockedAt = null;
        seat.lockExpiry = null;
      }
      showtime.availableSeats += requestedSeats.length;
      await showtime.save({ session });
      await session.abortTransaction();
      session.endSession();
      releaseLocks(showtimeId, seatIds, userId);
      return res.status(402).json({ success: false, message: 'Payment failed. Seats released.' });
    }

    // Step 5: Create Reservation document
    const theater = await showtime.populate('theater');
    const ticketPrice = showtime.theater?.basePrice
      ? showtime.theater.basePrice * showtime.priceMultiplier
      : 250 * showtime.priceMultiplier;

    const subtotal = ticketPrice * requestedSeats.length;
    const bookingFee = Math.round(subtotal * BOOKING_FEE_PERCENT);
    const totalAmount = subtotal + bookingFee;

    const reservation = await Reservation.create(
      [
        {
          user: userId,
          showtime: showtimeId,
          movie: showtime.movie,
          theater: showtime.theater?._id || showtime.theater,
          seats: requestedSeats.map((s) => ({ seatId: s.seatId, row: s.row, column: s.column })),
          totalTickets: requestedSeats.length,
          ticketPrice,
          bookingFee,
          totalAmount,
          status: 'confirmed',
          paymentMethod,
          paymentStatus: 'success',
          bookingSnapshot: {
            movieTitle: showtime.movie?.title || '',
            theaterName: showtime.theater?.name || '',
            showDate: showtime.date,
            showTime: showtime.time,
            format: showtime.format,
            language: showtime.language,
          },
        },
      ],
      { session }
    );

    // Step 6: Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Release in-memory locks (seats are now permanently occupied in DB)
    releaseLocks(showtimeId, seatIds, userId);

    const populatedReservation = await Reservation.findById(reservation[0]._id)
      .populate('movie', 'title posterUrl duration')
      .populate('theater', 'name location');

    res.status(201).json({
      success: true,
      message: 'Booking confirmed!',
      data: populatedReservation,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    releaseLocks(showtimeId, seatIds, userId);
    throw error;
  }
};

// @desc    Get user's booking history
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
  const reservations = await Reservation.find({ user: req.user._id, status: { $ne: 'failed' } })
    .populate('movie', 'title posterUrl duration genre')
    .populate('theater', 'name location')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: reservations.length, data: reservations });
};

// @desc    Cancel a booking and release seats
// @route   POST /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const reservation = await Reservation.findById(req.params.id).session(session);

    if (!reservation) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (reservation.user.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking.' });
    }

    if (reservation.status === 'cancelled') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: 'Booking is already cancelled.' });
    }

    // Release seats in showtime
    const showtime = await Showtime.findById(reservation.showtime).session(session);
    if (showtime) {
      for (const bookedSeat of reservation.seats) {
        const seat = showtime.seats.find((s) => s.seatId === bookedSeat.seatId);
        if (seat) {
          seat.status = 'available';
          seat.lockedBy = null;
          seat.lockedAt = null;
          seat.lockExpiry = null;
        }
      }
      showtime.availableSeats += reservation.seats.length;
      await showtime.save({ session });
    }

    // Update reservation status
    reservation.status = 'cancelled';
    reservation.paymentStatus = 'refunded';
    reservation.cancelledAt = new Date();
    reservation.cancelReason = req.body.reason || 'User requested cancellation';
    await reservation.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled and seats released.',
      data: reservation,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  const reservation = await Reservation.findById(req.params.id)
    .populate('movie', 'title posterUrl duration genre rating')
    .populate('theater', 'name location');

  if (!reservation) {
    return res.status(404).json({ success: false, message: 'Booking not found.' });
  }

  if (reservation.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized.' });
  }

  res.status(200).json({ success: true, data: reservation });
};

module.exports = { reserveSeats, getMyBookings, cancelBooking, getBookingById };
