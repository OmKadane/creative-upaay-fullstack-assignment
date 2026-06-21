const mongoose = require('mongoose');

// Seat sub-document: tracks individual seat status per showtime
const seatSchema = new mongoose.Schema({
  seatId: { type: String, required: true }, // e.g. "A1", "B12"
  row: { type: String, required: true },    // "A" - "M"
  column: { type: Number, required: true }, // 1 - 12
  status: {
    type: String,
    enum: ['available', 'occupied', 'locked'],
    default: 'available',
  },
  lockedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  lockedAt: { type: Date, default: null },
  lockExpiry: { type: Date, default: null },
});

const showtimeSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theater',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Showtime date is required'],
    },
    time: {
      type: String,  // "10:30 AM"
      required: [true, 'Showtime time is required'],
    },
    format: {
      type: String,
      enum: ['2D', '3D', 'IMAX', '4DX'],
      required: true,
    },
    screen: {
      type: Number,
      default: 1,
    },
    language: {
      type: String,
      default: 'English',
    },
    priceMultiplier: {
      type: Number,
      default: 1.0, // multiplied by theater.basePrice
    },
    seats: [seatSchema],
    totalSeats: {
      type: Number,
      default: 156, // 13 rows × 12 columns
    },
    availableSeats: {
      type: Number,
      default: 156,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Auto-generate seat map on creation if seats array is empty
showtimeSchema.pre('save', function (next) {
  if (this.seats.length === 0) {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
    const cols = 12;
    const seats = [];
    for (const row of rows) {
      for (let col = 1; col <= cols; col++) {
        seats.push({
          seatId: `${row}${col}`,
          row,
          column: col,
          status: 'available',
          lockedBy: null,
          lockedAt: null,
          lockExpiry: null,
        });
      }
    }
    this.seats = seats;
    this.totalSeats = seats.length;
    this.availableSeats = seats.length;
  }
  next();
});

module.exports = mongoose.model('Showtime', showtimeSchema);
