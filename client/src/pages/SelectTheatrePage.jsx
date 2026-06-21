import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { MapPin, ChevronRight } from 'lucide-react';
import { getShowtimesForMovie } from '../services/bookingService';
import { getMovieById } from '../services/movieService';
import { setSelectedMovie } from '../store/slices/bookingSlice';
import Header from '../components/layout/Header';
import { getDayLabel } from '../utils/helpers';

const SelectTheatrePage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Generate next 8 dates
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
    const loadMovie = async () => {
      try {
        const res = await getMovieById(movieId);
        setMovie(res.data.data);
        dispatch(setSelectedMovie(res.data.data));
      } catch (err) {
        console.error(err);
      }
    };
    loadMovie();
  }, [movieId, dispatch]);

  useEffect(() => {
    if (!selectedDate) return;
    const loadShowtimes = async () => {
      setLoading(true);
      try {
        const res = await getShowtimesForMovie(movieId, {
          date: selectedDate.toISOString().split('T')[0],
        });
        setShowtimes(res.data.data);
      } catch (err) {
        console.error(err);
        setShowtimes([]);
      } finally {
        setLoading(false);
      }
    };
    loadShowtimes();
  }, [movieId, selectedDate]);

  // Group showtimes to get unique theaters
  const uniqueTheaters = showtimes.reduce((acc, st) => {
    if (!st.theater) return acc;
    const existing = acc.find((t) => t._id === st.theater._id);
    if (!existing) {
      acc.push({
        ...st.theater,
        minPrice: st.theater.basePrice, // minimum price starting value
      });
    }
    return acc;
  }, []);

  const handleSelectTheater = (theaterId) => {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    navigate(`/select-schedule/${movieId}/${theaterId}?date=${formattedDate}`);
  };

  return (
    <div className="page-container bg-[#F7F8FD]">
      <Header title={movie?.title || 'Select Theatre'} />

      {/* Date selector */}
      <div className="py-4 px-5 bg-white border-b border-[#E5E7EB] shadow-sm">
        <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2.5">Select Date</p>
        <div className="scroll-x flex gap-2">
          {dates.map((date) => {
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-2.5 rounded-2xl transition-all duration-200 min-w-[54px] ${
                  isSelected
                    ? 'bg-[#5B51DE] text-white shadow shadow-[#5B51DE]/25'
                    : 'bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280]'
                }`}
              >
                <span className={`text-[9px] font-bold uppercase ${isSelected ? 'text-[#EEF0FF]' : 'text-[#9CA3AF]'}`}>
                  {getDayLabel(date)}
                </span>
                <span className={`text-base font-display font-bold leading-none ${isSelected ? 'text-white' : 'text-[#1A1A1A]'}`}>
                  {date.getDate()}
                </span>
                <span className={`text-[9px] ${isSelected ? 'text-[#EEF0FF]' : 'text-[#9CA3AF]'}`}>
                  {date.toLocaleDateString('en-IN', { month: 'short' })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Theatres list */}
      <div className="px-5 py-5 space-y-4">
        <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Available Theatres</p>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-28 w-full rounded-2xl" />
          ))
        ) : uniqueTheaters.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
            <p className="text-3xl mb-2">🎭</p>
            <p className="text-sm font-semibold text-[#1A1A1A]">No theaters playing this movie</p>
            <p className="text-xs text-[#6B7280] mt-1">Try choosing another date above.</p>
          </div>
        ) : (
          uniqueTheaters.map((theater) => (
            <button
              key={theater._id}
              onClick={() => handleSelectTheater(theater._id)}
              className="w-full text-left bg-white border border-[#E5E7EB] rounded-2xl p-4.5 shadow-sm hover:border-[#5B51DE] hover:shadow transition-all duration-200 active:scale-98 flex items-center justify-between group"
            >
              <div>
                <h3 className="font-bold text-sm text-[#1A1A1A] group-hover:text-[#5B51DE] transition-colors">{theater.name}</h3>
                <p className="text-[11px] text-[#6B7280] flex items-center gap-1 mt-1">
                  <MapPin size={12} className="text-[#5B51DE]" />
                  {theater.location?.city || 'Mumbai'}
                </p>
                <p className="text-[11px] text-[#6B7280] mt-2 font-medium">
                  Tickets starting from <span className="text-[#1A1A1A] font-bold">₹{theater.minPrice}</span>
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#EEF0FF] flex items-center justify-center text-[#5B51DE] group-hover:bg-[#5B51DE] group-hover:text-white transition-all duration-200">
                <ChevronRight size={16} />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default SelectTheatrePage;
