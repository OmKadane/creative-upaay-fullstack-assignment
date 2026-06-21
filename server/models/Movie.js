const mongoose = require('mongoose');

const castMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  photo: { type: String, default: '' },
});

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
    },
    genre: {
      type: [String],
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Duration is required'],
    },
    rating: {
      type: String,
      enum: ['G', 'PG', 'PG-13', 'R', 'NC-17', 'U', 'UA'],
      default: 'PG-13',
    },
    imdbRating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    posterUrl: {
      type: String,
      required: true,
    },
    bannerUrl: {
      type: String,
      default: '',
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    cast: [castMemberSchema],
    formats: {
      type: [String],
      enum: ['2D', '3D', 'IMAX', '4DX'],
      default: ['2D'],
    },
    language: {
      type: String,
      default: 'English',
    },
    status: {
      type: String,
      enum: ['now_showing', 'coming_soon', 'ended'],
      default: 'now_showing',
    },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
