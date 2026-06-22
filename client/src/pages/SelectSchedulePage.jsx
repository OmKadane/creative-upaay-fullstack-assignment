import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Clock, Film } from 'lucide-react';
import locationIcon from '../assets/location.svg';
import { getShowtimesForMovie } from '../services/bookingService';
import { getMovieById } from '../services/movieService';
import { getTheaters } from '../services/bookingService';
import {
  setSelectedMovie,
  setSelectedShowtime,
  setTicketPrice,
} from '../store/slices/bookingSlice';
import { resetSeatState } from '../store/slices/seatSlice';
import Header from '../components/layout/Header';
import { calcTicketPrice, formatDate } from '../utils/helpers';

const SelectSchedulePage = () => {
  const { movieId, theaterId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedDateStr = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const [movie, setMovie] = useState(null);
  const [theater, setTheater] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [activeFormat, setActiveFormat] = useState('2D');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load movie
        const movieRes = await getMovieById(movieId);
        setMovie(movieRes.data.data);
        dispatch(setSelectedMovie(movieRes.data.data));

        // Load theater details
        const theaterRes = await getTheaters();
        const foundTheater = theaterRes.data.data.find((t) => t._id === theaterId);
        setTheater(foundTheater);

        // Load showtimes for this movie & date
        const showtimesRes = await getShowtimesForMovie(movieId, {
          date: selectedDateStr,
        });

        // Filter showtimes for this specific theater
        const filtered = showtimesRes.data.data.filter(
          (st) => st.theater?._id === theaterId
        );
        setShowtimes(filtered);

        // Automatically select the first available format tab
        const availableFormats = [...new Set(filtered.map((s) => s.format))];
        if (availableFormats.length > 0) {
          setActiveFormat(availableFormats.includes('2D') ? '2D' : availableFormats[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [movieId, theaterId, selectedDateStr, dispatch]);

  // Group filtered showtimes by screen (e.g. Screen 1 vs Screen 2) for the active format
  const formatShowtimes = showtimes.filter((st) => st.format === activeFormat);
  const screens = [...new Set(formatShowtimes.map((st) => st.screen || 1))].sort();

  const handleSelectShowtime = (showtime) => {
    dispatch(setSelectedShowtime(showtime));
    const price = calcTicketPrice(
      theater?.basePrice || 250,
      showtime.format
    );
    dispatch(setTicketPrice(price));
    dispatch(resetSeatState());
    navigate(`/seat-selection/${showtime._id}`);
  };

  // Get available format tabs
  const formats = [...new Set(showtimes.map((st) => st.format))];

  return (
    <div className="page-container bg-[#F7F8FD]">
      <Header title="Select Schedule" />

      {/* Movie & Theater Summary Card */}
      <div className="mx-5 my-4 bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-sm">
        <div className="flex gap-4">
          <img
            src={movie?.posterUrl}
            alt={movie?.title}
            className="w-16 h-24 object-cover rounded-xl border border-[#E5E7EB] shadow-sm"
          />
          <div className="flex flex-col justify-center">
            <h2 className="font-bold text-sm text-[#1A1A1A]">{movie?.title}</h2>
            <p className="text-[11px] text-[#6B7280] mt-0.5">{movie?.genre?.join(' • ')}</p>
            <div className="h-px bg-[#E5E7EB] my-1.5" />
            <h3 className="font-bold text-xs text-[#5B51DE] flex items-center gap-1">
              <img src={locationIcon} style={{ width: '11px', height: '14px', flexShrink: 0 }} alt="location" />
              <span className="leading-none">{theater?.name}</span>
            </h3>
            <p className="text-[10px] text-[#6B7280] ml-4">
              {formatDate(new Date(selectedDateStr))}
            </p>
          </div>
        </div>
      </div>

      {/* Format Selector Tabs */}
      <div className="mx-5 mb-5 bg-white border border-[#E5E7EB] p-1 rounded-2xl shadow-sm flex">
        {formats.length === 0 ? (
          <div className="py-2 text-center text-xs text-[#6B7280] w-full">No formats available</div>
        ) : (
          formats.map((format) => (
            <button
              key={format}
              onClick={() => setActiveFormat(format)}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                activeFormat === format
                  ? 'bg-[#5B51DE] text-white shadow'
                  : 'text-[#6B7280] hover:text-[#1A1A1A]'
              }`}
            >
              {format}
            </button>
          ))
        )}
      </div>

      {/* Screens & Time Slots */}
      <div className="px-5 space-y-4">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="skeleton h-32 w-full rounded-2xl" />
          ))
        ) : formatShowtimes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
            <p className="text-3xl mb-2">⏰</p>
            <p className="text-sm font-semibold text-[#1A1A1A]">No showtimes for this format</p>
            <p className="text-xs text-[#6B7280] mt-1">Please select another format tab above.</p>
          </div>
        ) : (
          screens.map((screenNum) => {
            const screenShowtimes = formatShowtimes.filter((st) => (st.screen || 1) === screenNum);
            return (
              <div key={screenNum} className="bg-white border border-[#E5E7EB] rounded-2xl p-4.5 shadow-sm">
                {/* Screen Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] mb-3.5">
                  <span className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                    <Film size={14} className="text-[#5B51DE]" /> Screen {screenNum}
                  </span>
                  <span className="text-[10px] font-semibold text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-md">
                    {activeFormat} Format
                  </span>
                </div>

                {/* Showtime Slots Grid */}
                <div className="grid grid-cols-3 gap-2.5">
                  {screenShowtimes.map((st) => {
                    const isSoldOut = st.availableSeats === 0;
                    const isLow = st.availableSeats > 0 && st.availableSeats < 20;
                    return (
                      <button
                        key={st._id}
                        onClick={() => !isSoldOut && handleSelectShowtime(st)}
                        disabled={isSoldOut}
                        className={`flex flex-col items-center py-2.5 rounded-xl border text-xs font-semibold transition-all duration-150 active:scale-95 ${
                          isSoldOut
                            ? 'border-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed bg-[#F9FAFB]'
                            : 'border-[#5B51DE]/30 text-[#1A1A1A] bg-white hover:border-[#5B51DE] hover:bg-[#EEF0FF] shadow-sm'
                        }`}
                      >
                        <span className="font-bold text-sm">{st.time}</span>
                        {isSoldOut ? (
                          <span className="text-[9px] font-bold text-[#EF4444] mt-0.5">Sold Out</span>
                        ) : isLow ? (
                          <span className="text-[9px] font-bold text-amber-500 mt-0.5">Few Left</span>
                        ) : (
                          <span className="text-[9px] font-semibold text-emerald-500 mt-0.5">
                            {st.availableSeats} Seats
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SelectSchedulePage;
