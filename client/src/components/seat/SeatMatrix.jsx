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
      <div className="w-4/5 h-1 bg-gradient-to-r from-transparent via-[#5B51DE] to-transparent rounded-full shadow-[0_2px_8px_rgba(91,81,222,0.25)] mb-1" />
      <div className="w-3/5 h-0.5 bg-gradient-to-r from-transparent via-[#5B51DE]/30 to-transparent rounded-full" />
      <p className="text-[9px] text-[#9CA3AF] mt-2 tracking-widest uppercase font-bold">Screen This Way</p>
    </div>
  </div>
);

const SeatLegend = () => (
  <div className="flex items-center justify-center gap-5 py-4 px-5 border-t border-[#E5E7EB] mt-3 bg-white">
    {[
      { label: 'Available', className: 'w-4.5 h-4.5 rounded-md border border-[#D1D5DB] bg-white' },
      { label: 'Selected', className: 'w-4.5 h-4.5 rounded-md bg-[#5B51DE]' },
      { label: 'Occupied', className: 'w-4.5 h-4.5 rounded-md bg-[#E5E7EB] border border-[#E5E7EB]' },
    ].map(({ label, className }) => (
      <div key={label} className="flex items-center gap-1.5">
        <div className={className} />
        <span className="text-[10px] text-[#6B7280] font-semibold">{label}</span>
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
              <div key={i} className="w-7 text-center text-[9px] text-[#9CA3AF] font-bold">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Seat rows */}
          {ROWS.map((row) => (
            <div key={row} className="flex items-center gap-1 mb-1.5">
              {/* Row label */}
              <div className="w-5 text-[10px] text-[#9CA3AF] font-bold text-center flex-shrink-0">
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
