import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Star, Clock, Film, ChevronRight, Users, ChevronLeft } from 'lucide-react';
import { getMovieById } from '../services/movieService';
import { setSelectedMovie } from '../store/slices/bookingSlice';
import { formatDuration } from '../utils/helpers';

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMovieById(id);
        setMovie(res.data.data);
        dispatch(setSelectedMovie(res.data.data));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="page-container bg-[#F7F8FD]">
        <div className="skeleton w-full h-64 rounded-none mb-4" />
        <div className="px-5 space-y-3">
          <div className="skeleton h-6 w-3/4 rounded" />
          <div className="skeleton h-4 w-1/2 rounded" />
          <div className="skeleton h-20 w-full rounded" />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="page-container bg-[#F7F8FD] flex items-center justify-center">
        <p className="text-[#6B7280]">Movie not found.</p>
      </div>
    );
  }

  return (
    <div className="page-container bg-[#F7F8FD]">
      {/* Hero Banner */}
      <div className="relative h-72 w-full overflow-hidden">
        <img
          src={movie.bannerUrl || movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F7F8FD] via-[#F7F8FD]/40 to-transparent" />

        {/* Floating back button */}
        <div className="absolute top-4 left-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-xl bg-white/90 backdrop-blur-xs text-[#1A1A1A] border border-[#E5E7EB] active:scale-95 transition-transform shadow-sm flex items-center justify-center"
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Floating rating */}
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-xs border border-[#E5E7EB] rounded-full px-3 py-1.5 shadow-sm">
          <Star size={12} className="text-amber-400 fill-amber-400" />
          <span className="text-sm font-bold text-[#1A1A1A]">{movie.imdbRating?.toFixed(1)}</span>
          <span className="text-[10px] text-[#6B7280]">/10</span>
        </div>

        {/* Movie info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {movie.genre?.map((g) => (
              <span key={g} className="badge-brand text-[9px] font-semibold">{g}</span>
            ))}
          </div>
          <h1 className="font-display font-bold text-2xl text-[#1A1A1A] leading-tight mb-1">
            {movie.title}
          </h1>
        </div>
      </div>

      {/* Info chips */}
      <div className="flex items-center gap-4 px-5 py-4 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-1.5 text-xs text-[#6B7280] font-semibold">
          <Clock size={14} className="text-[#5B51DE]" />
          <span>{formatDuration(movie.duration)}</span>
        </div>
        <div className="w-px h-4 bg-[#E5E7EB]" />
        <div className="flex items-center gap-1.5 text-xs text-[#6B7280] font-semibold">
          <Film size={14} className="text-[#5B51DE]" />
          <span>{movie.rating}</span>
        </div>
        <div className="w-px h-4 bg-[#E5E7EB]" />
        <div className="flex items-center gap-1.5 text-xs text-[#6B7280] font-semibold">
          <span className="text-[#5B51DE]">{movie.language}</span>
        </div>
      </div>

      {/* Synopsis */}
      <div className="px-5 py-4">
        <h2 className="text-xs font-bold text-[#1A1A1A] tracking-wider uppercase mb-2">Synopsis</h2>
        <p className="text-sm text-[#6B7280] leading-relaxed">{movie.description}</p>
      </div>

      {/* Formats */}
      <div className="px-5 pb-4">
        <h2 className="text-xs font-bold text-[#1A1A1A] tracking-wider uppercase mb-3">Available Formats</h2>
        <div className="flex gap-2">
          {movie.formats?.map((format) => (
            <div key={format} className="flex-1 py-3 rounded-xl border border-[#E5E7EB] bg-white text-center shadow-sm">
              <span className="text-xs font-bold text-[#1A1A1A]">{format}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cast */}
      {movie.cast && movie.cast.length > 0 && (
        <div className="px-5 pb-4">
          <h2 className="text-xs font-bold text-[#1A1A1A] tracking-wider uppercase mb-3 flex items-center gap-2">
            <Users size={14} className="text-[#5B51DE]" />
            Cast
          </h2>
          <div className="scroll-x flex gap-3.5">
            {movie.cast.map((member, i) => (
              <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1.5 w-16">
                <div className="w-12 h-12 rounded-full bg-[#EEF0FF] border border-[#C7C3F7] flex items-center justify-center text-[#5B51DE] font-bold text-sm shadow-sm">
                  {member.name.charAt(0)}
                </div>
                <p className="text-[10px] text-[#1A1A1A] font-bold text-center leading-tight line-clamp-1">
                  {member.name}
                </p>
                <p className="text-[9px] text-[#6B7280] text-center line-clamp-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Book Now CTA */}
      <div className="sticky bottom-20 px-5 pb-5 mt-4">
        {movie.status === 'now_showing' ? (
          <button
            onClick={() => navigate(`/select-theatre/${movie._id}`)}
            className="btn-brand w-full flex items-center justify-center gap-2 shadow-lg shadow-[#5B51DE]/25"
          >
            Book Tickets
            <ChevronRight size={18} />
          </button>
        ) : (
          <button className="btn-ghost w-full" disabled>
            Coming Soon
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;
