import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getShowtimeSeats } from '../services/bookingService';
import {
  fetchSeatsStart,
  fetchSeatsSuccess,
  fetchSeatsFailure,
  selectSeatMatrix,
  selectSeatsLoading,
  selectSelectedSeats,
} from '../store/slices/seatSlice';
import {
  selectSelectedShowtime,
  updatePricing,
} from '../store/slices/bookingSlice';
import SeatMatrix from '../components/seat/SeatMatrix';
import PricePanel from '../components/seat/PricePanel';
import Header from '../components/layout/Header';
import { formatDate } from '../utils/helpers';

const SeatSelectionPage = () => {
  const { showtimeId } = useParams();
  const dispatch = useDispatch();

  const seats = useSelector(selectSeatMatrix);
  const loading = useSelector(selectSeatsLoading);
  const selectedSeats = useSelector(selectSelectedSeats);
  const showtime = useSelector(selectSelectedShowtime);

  // Fetch seat map
  useEffect(() => {
    const load = async () => {
      dispatch(fetchSeatsStart());
      try {
        const res = await getShowtimeSeats(showtimeId);
        dispatch(fetchSeatsSuccess({
          seats: res.data.data.seats,
          showtimeId,
        }));
      } catch (err) {
        dispatch(fetchSeatsFailure(err.message));
      }
    };
    load();
  }, [showtimeId, dispatch]);

  // Update pricing whenever selection changes
  useEffect(() => {
    dispatch(updatePricing(selectedSeats.length));
  }, [selectedSeats.length, dispatch]);

  return (
    <div className="h-screen flex flex-col bg-[#F7F8FD]">
      {/* Header */}
      <Header
        title={showtime?.movie?.title || 'Select Seats'}
        rightAction={
          showtime && (
            <div className="text-right">
              <p className="text-[9px] font-bold text-[#6B7280] truncate max-w-[120px]">{showtime.theater?.name}</p>
              <p className="text-[10px] text-[#5B51DE] font-semibold">
                {formatDate(showtime.date)} · {showtime.time}
              </p>
            </div>
          )
        }
      />

      {/* Price panel */}
      <PricePanel />

      {/* Seat grid */}
      <div className="flex-1 overflow-y-auto py-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-9 h-9 rounded-full border-2 border-[#5B51DE] border-t-transparent animate-spin" />
            <p className="text-xs font-semibold text-[#6B7280]">Loading seat map...</p>
          </div>
        ) : (
          <SeatMatrix seats={seats} />
        )}
      </div>

      {/* Selected seats summary bar */}
      {selectedSeats.length > 0 && (
        <div className="bg-white border-t border-[#E5E7EB] px-5 py-3.5 flex flex-wrap gap-1.5 shadow-sm">
          <span className="text-[10px] font-bold text-[#6B7280] w-full mb-1 uppercase tracking-wider">Selected Seats:</span>
          {selectedSeats.map((id) => (
            <span key={id} className="badge-brand text-xs font-bold px-2.5 py-0.5 rounded-full">{id}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeatSelectionPage;
