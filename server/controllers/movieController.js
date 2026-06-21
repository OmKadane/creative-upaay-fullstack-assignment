const Movie = require('../models/Movie');

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res) => {
  const { status, genre, format } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (genre) filter.genre = { $in: [genre] };
  if (format) filter.formats = { $in: [format] };

  const movies = await Movie.find(filter).sort({ releaseDate: -1 });

  res.status(200).json({ success: true, count: movies.length, data: movies });
};

// @desc    Get single movie by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    return res.status(404).json({ success: false, message: 'Movie not found.' });
  }

  res.status(200).json({ success: true, data: movie });
};

module.exports = { getMovies, getMovieById };
