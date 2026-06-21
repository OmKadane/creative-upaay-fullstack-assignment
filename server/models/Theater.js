const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Theater name is required'],
      trim: true,
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    screens: {
      type: Number,
      default: 1,
    },
    amenities: {
      type: [String],
      default: [],
    },
    basePrice: {
      type: Number,
      required: [true, 'Base ticket price is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    logo: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Theater', theaterSchema);
