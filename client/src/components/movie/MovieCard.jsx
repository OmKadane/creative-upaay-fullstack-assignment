import { useNavigate } from 'react-router-dom';
import { Star, Clock, Play } from 'lucide-react';
import { formatDuration } from '../../utils/helpers';

const MovieCard = ({ movie, variant = 'portrait' }) => {
  const navigate = useNavigate();

  if (variant === 'landscape') {
    return (
      <button
        onClick={() => navigate(`/movies/${movie._id}`)}
        className="card card-hover flex-shrink-0 w-72 flex overflow-hidden animate-fade-in active:scale-95 transition-transform duration-150 text-left"
      >
        <div className="relative w-28 flex-shrink-0">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-dark-800/40" />
        </div>
        <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="font-display font-semibold text-sm text-white leading-tight line-clamp-2 mb-1">
              {movie.title}
            </h3>
            <div className="flex flex-wrap gap-1 mb-2">
              {movie.genre?.slice(0, 2).map((g) => (
                <span key={g} className="badge-brand text-[10px] px-1.5 py-0.5 rounded-full">{g}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              {movie.imdbRating?.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {formatDuration(movie.duration)}
            </span>
          </div>
          <div className="flex gap-1 mt-2">
            {movie.formats?.map((f) => (
              <span key={f} className="text-[9px] px-1.5 py-0.5 rounded border border-dark-400 text-gray-400">{f}</span>
            ))}
          </div>
        </div>
      </button>
    );
  }

  // Portrait card (default)
  return (
    <button
      onClick={() => navigate(`/movies/${movie._id}`)}
      className="flex-shrink-0 w-36 text-left group animate-fade-in active:scale-95 transition-transform duration-150"
    >
      <div className="relative rounded-2xl overflow-hidden mb-2 shadow-card group-hover:shadow-card-hover transition-shadow duration-200">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />

        {/* Rating badge */}
        <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-dark-900/80 backdrop-blur-sm rounded-full px-2 py-0.5">
          <Star size={10} className="text-amber-400 fill-amber-400" />
          <span className="text-[10px] text-white font-medium">{movie.imdbRating?.toFixed(1)}</span>
        </div>

        {/* Play button hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-brand-500/90 rounded-full p-3 shadow-brand">
            <Play size={16} className="text-white fill-white" />
          </div>
        </div>

        {/* Coming soon overlay */}
        {movie.status === 'coming_soon' && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-dark-900 to-transparent py-2 px-2">
            <span className="badge-warning text-[9px]">Coming Soon</span>
          </div>
        )}
      </div>

      <h3 className="font-display font-semibold text-xs text-white leading-tight line-clamp-2 mb-1">
        {movie.title}
      </h3>
      <div className="flex items-center gap-2 text-[10px] text-gray-400">
        <span className="flex items-center gap-0.5">
          <Clock size={10} />
          {formatDuration(movie.duration)}
        </span>
        <span className="text-dark-400">•</span>
        <span>{movie.formats?.[0] || '2D'}</span>
      </div>
    </button>
  );
};

export default MovieCard;
