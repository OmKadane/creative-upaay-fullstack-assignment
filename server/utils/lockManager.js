/**
 * In-memory distributed lock manager for preventing seat double-booking
 * during concurrent reservation requests.
 *
 * Each lock is keyed by `${showtimeId}:${seatId}` and has a configurable TTL.
 * Expired locks are auto-released on the next acquisition attempt.
 */

const LOCK_TTL_MS = 30 * 1000; // 30 seconds

const locks = new Map();

/**
 * Attempt to acquire locks for multiple seats in a showtime.
 * @param {string} showtimeId
 * @param {string[]} seatIds
 * @param {string} userId
 * @returns {{ acquired: boolean, conflictingSeats: string[] }}
 */
const acquireLocks = (showtimeId, seatIds, userId) => {
  const now = Date.now();
  const conflictingSeats = [];

  // Check for existing valid locks first (no partial acquisition)
  for (const seatId of seatIds) {
    const key = `${showtimeId}:${seatId}`;
    const lock = locks.get(key);
    if (lock && lock.expiry > now && lock.userId !== userId) {
      conflictingSeats.push(seatId);
    }
  }

  if (conflictingSeats.length > 0) {
    return { acquired: false, conflictingSeats };
  }

  // All clear — acquire locks
  for (const seatId of seatIds) {
    const key = `${showtimeId}:${seatId}`;
    locks.set(key, { userId, expiry: now + LOCK_TTL_MS });
  }

  return { acquired: true, conflictingSeats: [] };
};

/**
 * Release locks for specific seats in a showtime.
 * @param {string} showtimeId
 * @param {string[]} seatIds
 * @param {string} userId
 */
const releaseLocks = (showtimeId, seatIds, userId) => {
  for (const seatId of seatIds) {
    const key = `${showtimeId}:${seatId}`;
    const lock = locks.get(key);
    if (lock && lock.userId === userId) {
      locks.delete(key);
    }
  }
};

/**
 * Clean up all expired locks. Call periodically in production.
 */
const cleanupExpiredLocks = () => {
  const now = Date.now();
  for (const [key, lock] of locks.entries()) {
    if (lock.expiry <= now) {
      locks.delete(key);
    }
  }
};

// Run cleanup every 60 seconds
setInterval(cleanupExpiredLocks, 60 * 1000);

module.exports = { acquireLocks, releaseLocks, cleanupExpiredLocks };
