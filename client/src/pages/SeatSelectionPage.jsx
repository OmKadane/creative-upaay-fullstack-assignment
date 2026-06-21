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
    <div className="h-screen flex flex-col bg-dark-900">
      {/* Header */}
      <Header
        title={showtime?.movie?.title || 'Select Seats'}
        rightAction={
          showtime && (
            <div className="text-right">
              <p className="text-[10px] text-gray-500">{showtime.theater?.name}</p>
              <p className="text-xs text-brand-400 font-medium">
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
            <div className="w-10 h-10 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
            <p className="text-sm text-gray-400">Loading seat map...</p>
          </div>
        ) : (
          <SeatMatrix seats={seats} />
        )}
      </div>

      {/* Selected seats summary bar */}
      {selectedSeats.length > 0 && (
        <div className="glass border-t border-dark-600/30 px-5 py-3 flex flex-wrap gap-1.5">
          <span className="text-[10px] text-gray-400 w-full mb-1">Selected:</span>
          {selectedSeats.map((id) => (
            <span key={id} className="badge-brand text-xs">{id}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeatSelectionPage;
