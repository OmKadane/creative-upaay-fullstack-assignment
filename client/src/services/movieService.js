import api from './api';

export const getMovies = (params = {}) => api.get('/movies', { params });
export const getMovieById = (id) => api.get(`/movies/${id}`);
