const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    showtime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Showtime',
      required: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theater',
      required: true,
    },
    seats: [
      {
        seatId: { type: String, required: true },
        row: { type: String, required: true },
        column: { type: Number, required: true },
      },
    ],
    totalTickets: {
      type: Number,
      required: true,
    },
    ticketPrice: {
      type: Number,
      required: true,
    },
    bookingFee: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'wallet'],
      default: 'card',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'success', 'failed', 'refunded'],
      default: 'pending',
    },
    // Snapshot of booking details for historical reference
    bookingSnapshot: {
      movieTitle: String,
      theaterName: String,
      showDate: Date,
      showTime: String,
      format: String,
      language: String,
    },
    bookingCode: {
      type: String,
      unique: true,
    },
    qrCode: {
      type: String,  // base64 or URL
      default: '',
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancelReason: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Generate unique booking code
reservationSchema.pre('save', function (next) {
  if (!this.bookingCode) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.bookingCode = `CB-${timestamp}-${random}`;
  }
  next();
});

// Indexes for performance
reservationSchema.index({ user: 1, createdAt: -1 });
reservationSchema.index({ showtime: 1 });
reservationSchema.index({ bookingCode: 1 }, { unique: true });

module.exports = mongoose.model('Reservation', reservationSchema);
