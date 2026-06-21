const express = require('express');
const {
  reserveSeats,
  getMyBookings,
  cancelBooking,
  getBookingById,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All booking routes require authentication
router.use(protect);

router.post('/reserve', reserveSeats);
router.get('/my-bookings', getMyBookings);
router.get('/:id', getBookingById);
router.post('/:id/cancel', cancelBooking);

module.exports = router;
