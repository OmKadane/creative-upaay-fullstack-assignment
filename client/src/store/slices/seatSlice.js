import { createSlice } from '@reduxjs/toolkit';

const MAX_SEATS = 6;

const initialState = {
  // The full seat matrix fetched from API
  seatMatrix: [],
  // IDs of seats user has selected
  selectedSeats: [],   // Array of seatId strings e.g. ["A1", "B3"]
  selectedSeatObjects: [], // Full seat objects for display
  showtimeId: null,
  loading: false,
  error: null,
};

const seatSlice = createSlice({
  name: 'seat',
  initialState,
  reducers: {
    fetchSeatsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSeatsSuccess(state, action) {
      state.loading = false;
      state.seatMatrix = action.payload.seats;
      state.showtimeId = action.payload.showtimeId;
      // Re-apply selected state from persisted selectedSeats
      state.seatMatrix = state.seatMatrix.map((seat) => ({
        ...seat,
        status: state.selectedSeats.includes(seat.seatId)
          ? 'selected_local'
          : seat.status,
      }));
    },
    fetchSeatsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    toggleSeat(state, action) {
      const seatId = action.payload;
      const seat = state.seatMatrix.find((s) => s.seatId === seatId);
      if (!seat || seat.status === 'occupied' || seat.status === 'locked') return;

      const isSelected = state.selectedSeats.includes(seatId);

      if (isSelected) {
        // Deselect
        state.selectedSeats = state.selectedSeats.filter((id) => id !== seatId);
        state.selectedSeatObjects = state.selectedSeatObjects.filter((s) => s.seatId !== seatId);
        seat.status = 'available';
      } else {
        // Select (cap at MAX_SEATS)
        if (state.selectedSeats.length >= MAX_SEATS) return;
        state.selectedSeats.push(seatId);
        state.selectedSeatObjects.push({ ...seat, status: 'selected_local' });
        seat.status = 'selected_local';
      }
    },
    clearSeats(state) {
      state.selectedSeats = [];
      state.selectedSeatObjects = [];
      state.seatMatrix = state.seatMatrix.map((s) =>
        s.status === 'selected_local' ? { ...s, status: 'available' } : s
      );
    },
    resetSeatState(state) {
      state.seatMatrix = [];
      state.selectedSeats = [];
      state.selectedSeatObjects = [];
      state.showtimeId = null;
      state.loading = false;
      state.error = null;
    },
    updateSeatMatrix(state, action) {
      state.seatMatrix = action.payload;
    },
  },
});

export const {
  fetchSeatsStart,
  fetchSeatsSuccess,
  fetchSeatsFailure,
  toggleSeat,
  clearSeats,
  resetSeatState,
  updateSeatMatrix,
} = seatSlice.actions;

// Selectors
export const selectSeatMatrix = (state) => state.seat.seatMatrix;
export const selectSelectedSeats = (state) => state.seat.selectedSeats;
export const selectSelectedSeatObjects = (state) => state.seat.selectedSeatObjects;
export const selectSeatCount = (state) => state.seat.selectedSeats.length;
export const selectSeatsLoading = (state) => state.seat.loading;
export const selectShowtimeId = (state) => state.seat.showtimeId;
export const MAX_SEAT_COUNT = MAX_SEATS;

export default seatSlice.reducer;
