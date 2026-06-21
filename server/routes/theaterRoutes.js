const express = require('express');
const {
  getTheaters,
  getTheaterById,
  getTheaterShowtimes,
  getShowtimesForMovie,
  getShowtimeSeats,
} = require('../controllers/theaterController');

const router = express.Router();

router.get('/', getTheaters);
router.get('/showtimes/movie/:movieId', getShowtimesForMovie);
router.get('/showtimes/:showtimeId/seats', getShowtimeSeats);
router.get('/:id', getTheaterById);
router.get('/:id/showtimes', getTheaterShowtimes);

module.exports = router;
