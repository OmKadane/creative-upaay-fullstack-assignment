import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Clock, MapPin, ChevronRight } from 'lucide-react';
import { getShowtimesForMovie } from '../services/bookingService';
import { getMovieById } from '../services/movieService';
import {
  setSelectedMovie,
  setSelectedShowtime,
  setTicketPrice,
} from '../store/slices/bookingSlice';
import { resetSeatState } from '../store/slices/seatSlice';
import Header from '../components/layout/Header';
import { getDayLabel, formatDate, calcTicketPrice } from '../utils/helpers';

const SchedulePage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Build next 8 dates
  const dates = Array.from({ length: 8 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  useEffect(() => {
    setSelectedDate(dates[0]);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const movieRes = await getMovieById(movieId);
        setMovie(movieRes.data.data);
        dispatch(setSelectedMovie(movieRes.data.data));
      } catch (e) { console.error(e); }
    };
    load();
  }, [movieId, dispatch]);

  useEffect(() => {
    if (!selectedDate) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await getShowtimesForMovie(movieId, {
          date: selectedDate.toISOString().split('T')[0],
        });
        setShowtimes(res.data.data);
      } catch (e) {
        console.error(e);
        setShowtimes([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [movieId, selectedDate]);

  // Group showtimes by theater
  const grouped = showtimes.reduce((acc, st) => {
    const key = st.theater?._id || 'unknown';
    if (!acc[key]) acc[key] = { theater: st.theater, showtimes: [] };
    acc[key].showtimes.push(st);
    return acc;
  }, {});

  const handleSelectShowtime = (showtime) => {
    dispatch(setSelectedShowtime(showtime));
    const price = calcTicketPrice(
      showtime.theater?.basePrice || 250,
      showtime.format
    );
    dispatch(setTicketPrice(price));
    dispatch(resetSeatState());
    navigate(`/seat-selection/${showtime._id}`);
  };

  return (
    <div className="page-container">
      <Header title={movie?.title || 'Select Showtime'} />

      {/* Date selector */}
      <div className="py-4 px-5 border-b border-dark-600/30">
        <div className="scroll-x flex gap-2">
          {dates.map((date) => {
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-2.5 rounded-2xl transition-all duration-200 min-w-[52px] ${
                  isSelected
                    ? 'bg-brand-500 shadow-brand'
                    : 'bg-dark-700 hover:bg-dark-600'
                }`}
              >
                <span className={`text-[10px] font-medium uppercase ${isSelected ? 'text-brand-100' : 'text-gray-500'}`}>
                  {getDayLabel(date)}
                </span>
                <span className={`text-lg font-display font-bold leading-none ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                  {date.getDate()}
                </span>
                <span className={`text-[9px] ${isSelected ? 'text-brand-200' : 'text-gray-600'}`}>
                  {date.toLocaleDateString('en-IN', { month: 'short' })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Theatres & showtimes */}
      <div className="px-5 py-4 space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-32 w-full rounded-2xl" />
          ))
        ) : Object.keys(grouped).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🎭</p>
            <p className="text-gray-400 text-sm">No showtimes available for this date.</p>
            <p className="text-gray-600 text-xs mt-1">Try selecting another date.</p>
          </div>
        ) : (
          Object.values(grouped).map(({ theater, showtimes: stList }) => (
            <div key={theater?._id} className="card p-4">
              {/* Theater header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-sm text-white">{theater?.name}</h3>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={9} />
                    {theater?.location?.city}
                  </p>
                </div>
                <p className="text-xs text-brand-400 font-medium">
                  From ₹{theater?.basePrice}
                </p>
              </div>

              {/* Format groups */}
              {['2D', '3D', 'IMAX', '4DX'].map((format) => {
                const formatShowtimes = stList.filter((s) => s.format === format);
                if (formatShowtimes.length === 0) return null;
                return (
                  <div key={format} className="mb-3 last:mb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge-brand text-[10px]">{format}</span>
                      <span className="text-[10px] text-gray-500">
                        ₹{calcTicketPrice(theater?.basePrice || 250, format)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formatShowtimes.map((st) => {
                        const isSoldOut = st.availableSeats === 0;
                        const isLow = st.availableSeats > 0 && st.availableSeats < 20;
                        return (
                          <button
                            key={st._id}
                            onClick={() => !isSoldOut && handleSelectShowtime(st)}
                            disabled={isSoldOut}
                            className={`flex flex-col items-center px-3 py-2 rounded-xl border text-xs transition-all duration-150 active:scale-95 ${
                              isSoldOut
                                ? 'border-dark-500 text-dark-400 cursor-not-allowed bg-dark-700/30'
                                : 'border-dark-400 text-white hover:border-brand-500 hover:text-brand-400 bg-dark-700'
                            }`}
                          >
                            <span className="font-semibold">{st.time}</span>
                            {isSoldOut ? (
                              <span className="text-[9px] text-red-500 mt-0.5">Sold Out</span>
                            ) : isLow ? (
                              <span className="text-[9px] text-amber-400 mt-0.5">Few left</span>
                            ) : (
                              <span className="text-[9px] text-green-400 mt-0.5">{st.availableSeats} avail.</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SchedulePage;
