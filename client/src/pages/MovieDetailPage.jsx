import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Star, Clock, Film, ChevronRight, Users } from 'lucide-react';
import { getMovieById } from '../services/movieService';
import { setSelectedMovie } from '../store/slices/bookingSlice';
import Header from '../components/layout/Header';
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
      <div className="page-container">
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
      <div className="page-container flex items-center justify-center">
        <p className="text-gray-400">Movie not found.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Hero Banner */}
      <div className="relative h-72 w-full overflow-hidden">
        <img
          src={movie.bannerUrl || movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="banner-gradient absolute inset-0" />

        {/* Floating back button */}
        <div className="absolute top-4 left-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-xl glass text-white active:scale-95 transition-transform"
          >
            ←
          </button>
        </div>

        {/* Floating rating */}
        <div className="absolute top-4 right-4 flex items-center gap-1 glass rounded-full px-3 py-1.5">
          <Star size={12} className="text-amber-400 fill-amber-400" />
          <span className="text-sm font-bold text-white">{movie.imdbRating?.toFixed(1)}</span>
          <span className="text-[10px] text-gray-400">/10</span>
        </div>

        {/* Movie info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex flex-wrap gap-1 mb-2">
            {movie.genre?.map((g) => (
              <span key={g} className="badge-brand text-[10px]">{g}</span>
            ))}
          </div>
          <h1 className="font-display font-bold text-2xl text-white leading-tight mb-1">
            {movie.title}
          </h1>
        </div>
      </div>

      {/* Info chips */}
      <div className="flex items-center gap-4 px-5 py-4 border-b border-dark-600/30">
        <div className="flex items-center gap-1.5 text-sm text-gray-300">
          <Clock size={14} className="text-brand-400" />
          <span>{formatDuration(movie.duration)}</span>
        </div>
        <div className="w-px h-4 bg-dark-500" />
        <div className="flex items-center gap-1.5 text-sm text-gray-300">
          <Film size={14} className="text-brand-400" />
          <span>{movie.rating}</span>
        </div>
        <div className="w-px h-4 bg-dark-500" />
        <div className="flex items-center gap-1.5 text-sm text-gray-300">
          <span className="text-brand-400 text-xs font-bold">{movie.language}</span>
        </div>
      </div>

      {/* Synopsis */}
      <div className="px-5 py-4">
        <h2 className="text-sm font-semibold text-white mb-2">Synopsis</h2>
        <p className="text-sm text-gray-400 leading-relaxed">{movie.description}</p>
      </div>

      {/* Formats */}
      <div className="px-5 pb-4">
        <h2 className="text-sm font-semibold text-white mb-3">Available Formats</h2>
        <div className="flex gap-2">
          {movie.formats?.map((format) => (
            <div key={format} className="flex-1 py-3 rounded-xl border border-dark-400 text-center">
              <span className="text-sm font-bold text-white">{format}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cast */}
      {movie.cast && movie.cast.length > 0 && (
        <div className="px-5 pb-4">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Users size={14} className="text-brand-400" />
            Cast
          </h2>
          <div className="scroll-x flex gap-3">
            {movie.cast.map((member, i) => (
              <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1 w-16">
                <div className="w-14 h-14 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold text-sm">
                  {member.name.charAt(0)}
                </div>
                <p className="text-[10px] text-white font-medium text-center leading-tight line-clamp-2">
                  {member.name}
                </p>
                <p className="text-[9px] text-gray-500 text-center line-clamp-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Book Now CTA */}
      <div className="sticky bottom-20 px-5 pb-5">
        {movie.status === 'now_showing' ? (
          <button
            onClick={() => navigate(`/schedule/${movie._id}`)}
            className="btn-brand w-full flex items-center justify-center gap-2"
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
