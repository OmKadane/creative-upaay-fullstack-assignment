import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  movies: [],
  nowShowing: [],
  comingSoon: [],
  selectedMovie: null,
  loading: false,
  error: null,
};

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    fetchMoviesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchMoviesSuccess(state, action) {
      state.loading = false;
      state.movies = action.payload;
      state.nowShowing = action.payload.filter((m) => m.status === 'now_showing');
      state.comingSoon = action.payload.filter((m) => m.status === 'coming_soon');
    },
    fetchMoviesFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedMovie(state, action) {
      state.selectedMovie = action.payload;
    },
    clearSelectedMovie(state) {
      state.selectedMovie = null;
    },
  },
});

export const {
  fetchMoviesStart,
  fetchMoviesSuccess,
  fetchMoviesFailure,
  setSelectedMovie,
  clearSelectedMovie,
} = movieSlice.actions;

export const selectMovies = (state) => state.movies.movies;
export const selectNowShowing = (state) => state.movies.nowShowing;
export const selectComingSoon = (state) => state.movies.comingSoon;
export const selectSelectedMovie = (state) => state.movies.selectedMovie;
export const selectMoviesLoading = (state) => state.movies.loading;

export default movieSlice.reducer;
