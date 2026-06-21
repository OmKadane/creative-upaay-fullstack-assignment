/**
 * Utility helpers for the CineBook application
 */

/**
 * Format currency in Indian Rupees
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date to a readable short format  e.g. "Sat, 21 Jun"
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
};

/**
 * Format date to long format e.g. "Saturday, 21 June 2024"
 */
export const formatDateLong = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

/**
 * Format duration in minutes to "2h 46m"
 */
export const formatDuration = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

/**
 * Get array of next N dates starting from today
 */
export const getNextNDates = (n = 8) => {
  const dates = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
};

/**
 * Get day label: "Today", "Tomorrow", or short weekday
 */
export const getDayLabel = (date) => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const d = new Date(date);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return d.toLocaleDateString('en-IN', { weekday: 'short' });
};

/**
 * Group showtime data by theater for the schedule page
 */
export const groupShowtimesByTheater = (showtimes) => {
  return showtimes.reduce((acc, showtime) => {
    const theaterId = showtime.theater._id || showtime.theater;
    const theaterName = showtime.theater?.name || 'Unknown Theater';
    if (!acc[theaterId]) {
      acc[theaterId] = { theater: showtime.theater, showtimes: [] };
    }
    acc[theaterId].showtimes.push(showtime);
    return acc;
  }, {});
};

/**
 * Validate credit card number using Luhn algorithm
 */
export const luhnCheck = (cardNumber) => {
  const num = cardNumber.replace(/\s/g, '');
  if (!/^\d+$/.test(num)) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

/**
 * Format card number with spaces every 4 digits
 */
export const formatCardNumber = (value) => {
  return value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
};

/**
 * Get initials from name
 */
export const getInitials = (name = '') => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Calculate ticket price with format multiplier
 */
export const calcTicketPrice = (basePrice, format) => {
  const multipliers = { '2D': 1.0, '3D': 1.2, 'IMAX': 1.5, '4DX': 1.8 };
  return Math.round(basePrice * (multipliers[format] || 1.0));
};
