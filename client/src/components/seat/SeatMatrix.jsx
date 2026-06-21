import { useDispatch, useSelector } from 'react-redux';
import { toggleSeat, selectSelectedSeats, MAX_SEAT_COUNT } from '../../store/slices/seatSlice';
import toast from 'react-hot-toast';

// Row labels A–M
const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
const COLS = 12;

const ScreenIndicator = () => (
  <div className="mb-6 px-4">
    <div className="relative flex flex-col items-center">
      {/* Curved screen glow bar */}
      <div className="w-4/5 h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent rounded-full shadow-brand mb-1" />
      <div className="w-3/5 h-1 bg-gradient-to-r from-transparent via-brand-400/40 to-transparent rounded-full" />
      <p className="text-[10px] text-gray-500 mt-2 tracking-widest uppercase font-medium">Screen</p>
    </div>
  </div>
);

const SeatLegend = () => (
  <div className="flex items-center justify-center gap-5 py-4 px-5 border-t border-dark-600/40 mt-2">
    {[
      { label: 'Available', className: 'w-5 h-5 rounded-md border border-dark-400 bg-dark-500' },
      { label: 'Selected', className: 'w-5 h-5 rounded-md bg-brand-500 shadow-brand' },
      { label: 'Occupied', className: 'w-5 h-5 rounded-md bg-dark-600 border border-dark-600' },
    ].map(({ label, className }) => (
      <div key={label} className="flex items-center gap-1.5">
        <div className={className} />
        <span className="text-[10px] text-gray-400">{label}</span>
      </div>
    ))}
  </div>
);

const Seat = ({ seat, isSelected }) => {
  const dispatch = useDispatch();
  const selectedSeats = useSelector(selectSelectedSeats);

  const isOccupied = seat.status === 'occupied' || seat.status === 'locked';

  const handleClick = () => {
    if (isOccupied) return;

    if (!isSelected && selectedSeats.length >= MAX_SEAT_COUNT) {
      toast.error(`Maximum ${MAX_SEAT_COUNT} seats per booking`);
      return;
    }

    dispatch(toggleSeat(seat.seatId));
  };

  let seatClass = 'seat-available';
  if (isSelected) seatClass = 'seat-selected';
  else if (isOccupied) seatClass = 'seat-occupied';

  return (
    <button
      onClick={handleClick}
      disabled={isOccupied}
      className={seatClass}
      title={isOccupied ? 'Seat unavailable' : `Seat ${seat.seatId}`}
      aria-label={`Seat ${seat.seatId} - ${isOccupied ? 'occupied' : isSelected ? 'selected' : 'available'}`}
    />
  );
};

const SeatMatrix = ({ seats }) => {
  const selectedSeats = useSelector(selectSelectedSeats);

  // Group seats by row
  const seatsByRow = ROWS.reduce((acc, row) => {
    acc[row] = [];
    return acc;
  }, {});

  if (seats && seats.length > 0) {
    seats.forEach((seat) => {
      if (seatsByRow[seat.row] !== undefined) {
        seatsByRow[seat.row].push(seat);
      }
    });
    // Sort each row by column
    Object.keys(seatsByRow).forEach((row) => {
      seatsByRow[row].sort((a, b) => a.column - b.column);
    });
  }

  return (
    <div className="flex flex-col">
      <ScreenIndicator />

      {/* Scrollable seat grid */}
      <div className="overflow-x-auto scroll-x px-2">
        <div className="inline-block min-w-full">
          {/* Column numbers header */}
          <div className="flex items-center mb-1 ml-6 gap-1">
            {Array.from({ length: COLS }, (_, i) => (
              <div key={i} className="w-7 text-center text-[9px] text-gray-600 font-medium">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Seat rows */}
          {ROWS.map((row) => (
            <div key={row} className="flex items-center gap-1 mb-1.5">
              {/* Row label */}
              <div className="w-5 text-[10px] text-gray-500 font-medium text-center flex-shrink-0">
                {row}
              </div>

              {/* Seats */}
              <div className="flex gap-1">
                {/* Aisle gap after column 6 */}
                {(seatsByRow[row].length > 0 ? seatsByRow[row] : Array.from({ length: COLS }, (_, i) => ({
                  seatId: `${row}${i + 1}`,
                  row,
                  column: i + 1,
                  status: 'available',
                }))).map((seat, colIdx) => (
                  <div key={seat.seatId} className="flex items-center">
                    <Seat
                      seat={seat}
                      isSelected={selectedSeats.includes(seat.seatId)}
                    />
                    {/* Aisle gap */}
                    {colIdx === 5 && <div className="w-3" />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <SeatLegend />
    </div>
  );
};

export default SeatMatrix;
