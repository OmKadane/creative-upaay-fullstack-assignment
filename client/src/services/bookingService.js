import api from './api';

export const getTheaters = () => api.get('/theaters');
export const getTheaterShowtimes = (theaterId, params) =>
  api.get(`/theaters/${theaterId}/showtimes`, { params });
export const getShowtimesForMovie = (movieId, params) =>
  api.get(`/theaters/showtimes/movie/${movieId}`, { params });
export const getShowtimeSeats = (showtimeId) =>
  api.get(`/theaters/showtimes/${showtimeId}/seats`);

export const reserveSeats = (data) => api.post('/bookings/reserve', data);
export const getMyBookings = () => api.get('/bookings/my-bookings');
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const cancelBooking = (id, reason) =>
  api.post(`/bookings/${id}/cancel`, { reason });
