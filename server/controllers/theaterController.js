const Theater = require('../models/Theater');
const Showtime = require('../models/Showtime');

// @desc    Get all theaters
// @route   GET /api/theaters
// @access  Public
const getTheaters = async (req, res) => {
  const theaters = await Theater.find({ isActive: true }).sort({ name: 1 });
  res.status(200).json({ success: true, count: theaters.length, data: theaters });
};

// @desc    Get theater by ID
// @route   GET /api/theaters/:id
// @access  Public
const getTheaterById = async (req, res) => {
  const theater = await Theater.findById(req.params.id);
  if (!theater) {
    return res.status(404).json({ success: false, message: 'Theater not found.' });
  }
  res.status(200).json({ success: true, data: theater });
};

// @desc    Get showtimes for a theater (optionally filter by movieId and date)
// @route   GET /api/theaters/:id/showtimes
// @access  Public
const getTheaterShowtimes = async (req, res) => {
  const { movieId, date } = req.query;
  const filter = { theater: req.params.id, isActive: true };

  if (movieId) filter.movie = movieId;

  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    filter.date = { $gte: startOfDay, $lte: endOfDay };
  }

  const showtimes = await Showtime.find(filter)
    .populate('movie', 'title posterUrl duration formats')
    .populate('theater', 'name location basePrice maxPrice')
    .sort({ date: 1, time: 1 });

  res.status(200).json({ success: true, count: showtimes.length, data: showtimes });
};

// @desc    Get showtimes for a specific movie across all theaters
// @route   GET /api/theaters/showtimes/movie/:movieId
// @access  Public
const getShowtimesForMovie = async (req, res) => {
  const { date, format } = req.query;
  const filter = { movie: req.params.movieId, isActive: true };

  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    filter.date = { $gte: startOfDay, $lte: endOfDay };
  }

  if (format) filter.format = format;

  const showtimes = await Showtime.find(filter)
    .populate('theater', 'name location basePrice maxPrice')
    .sort({ date: 1, time: 1 });

  res.status(200).json({ success: true, count: showtimes.length, data: showtimes });
};

// @desc    Get seat map for a showtime
// @route   GET /api/theaters/showtimes/:showtimeId/seats
// @access  Public
const getShowtimeSeats = async (req, res) => {
  const showtime = await Showtime.findById(req.params.showtimeId)
    .populate('movie', 'title')
    .populate('theater', 'name basePrice');

  if (!showtime) {
    return res.status(404).json({ success: false, message: 'Showtime not found.' });
  }

  // Auto-expire locks
  const now = new Date();
  let lockExpired = false;
  for (const seat of showtime.seats) {
    if (seat.status === 'locked' && seat.lockExpiry && seat.lockExpiry < now) {
      seat.status = 'available';
      seat.lockedBy = null;
      seat.lockedAt = null;
      seat.lockExpiry = null;
      lockExpired = true;
    }
  }
  if (lockExpired) await showtime.save();

  res.status(200).json({ success: true, data: showtime });
};

module.exports = {
  getTheaters,
  getTheaterById,
  getTheaterShowtimes,
  getShowtimesForMovie,
  getShowtimeSeats,
};
