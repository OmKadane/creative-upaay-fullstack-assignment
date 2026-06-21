import { createSlice } from '@reduxjs/toolkit';

const BOOKING_FEE_PERCENT = 0.05;

const initialState = {
  // Selection state (persisted)
  selectedMovie: null,
  selectedShowtime: null,
  selectedTheater: null,
  selectedDate: null,
  selectedFormat: null,

  // Price
  ticketPrice: 0,
  currentTotalPrice: 0,
  bookingFee: 0,
  grandTotal: 0,

  // Completed booking
  confirmedBooking: null,
  bookings: [],
  bookingsLoading: false,
  bookingsError: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setSelectedMovie(state, action) {
      state.selectedMovie = action.payload;
    },
    setSelectedShowtime(state, action) {
      state.selectedShowtime = action.payload;
      if (action.payload) {
        state.selectedTheater = action.payload.theater;
        state.selectedDate = action.payload.date;
        state.selectedFormat = action.payload.format;
      }
    },
    setTicketPrice(state, action) {
      state.ticketPrice = action.payload;
    },
    updatePricing(state, action) {
      const seatCount = action.payload;
      const subtotal = state.ticketPrice * seatCount;
      state.currentTotalPrice = subtotal;
      state.bookingFee = Math.round(subtotal * BOOKING_FEE_PERCENT);
      state.grandTotal = subtotal + state.bookingFee;
    },
    setConfirmedBooking(state, action) {
      state.confirmedBooking = action.payload;
    },
    clearConfirmedBooking(state) {
      state.confirmedBooking = null;
    },
    fetchBookingsStart(state) {
      state.bookingsLoading = true;
      state.bookingsError = null;
    },
    fetchBookingsSuccess(state, action) {
      state.bookingsLoading = false;
      state.bookings = action.payload;
    },
    fetchBookingsFailure(state, action) {
      state.bookingsLoading = false;
      state.bookingsError = action.payload;
    },
    updateBookingInList(state, action) {
      const idx = state.bookings.findIndex((b) => b._id === action.payload._id);
      if (idx !== -1) state.bookings[idx] = action.payload;
    },
    resetBookingSelection(state) {
      state.selectedShowtime = null;
      state.selectedTheater = null;
      state.selectedDate = null;
      state.selectedFormat = null;
      state.ticketPrice = 0;
      state.currentTotalPrice = 0;
      state.bookingFee = 0;
      state.grandTotal = 0;
    },
  },
});

export const {
  setSelectedMovie,
  setSelectedShowtime,
  setTicketPrice,
  updatePricing,
  setConfirmedBooking,
  clearConfirmedBooking,
  fetchBookingsStart,
  fetchBookingsSuccess,
  fetchBookingsFailure,
  updateBookingInList,
  resetBookingSelection,
} = bookingSlice.actions;

// Selectors
export const selectBookingState = (state) => state.booking;
export const selectSelectedShowtime = (state) => state.booking.selectedShowtime;
export const selectTicketPrice = (state) => state.booking.ticketPrice;
export const selectCurrentTotalPrice = (state) => state.booking.currentTotalPrice;
export const selectBookingFee = (state) => state.booking.bookingFee;
export const selectGrandTotal = (state) => state.booking.grandTotal;
export const selectConfirmedBooking = (state) => state.booking.confirmedBooking;
export const selectMyBookings = (state) => state.booking.bookings;

export default bookingSlice.reducer;
