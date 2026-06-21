import { useNavigate } from 'react-router-dom';
import { Star, Clock, Play } from 'lucide-react';
import { formatDuration } from '../../utils/helpers';

const MovieCard = ({ movie, variant = 'portrait' }) => {
  const navigate = useNavigate();

  if (variant === 'landscape') {
    return (
      <button
        onClick={() => navigate(`/movies/${movie._id}`)}
        className="card card-hover flex-shrink-0 w-80 flex overflow-hidden animate-fade-in active:scale-95 transition-transform duration-150 text-left bg-white border border-[#E5E7EB]"
      >
        <div className="relative w-28 flex-shrink-0">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 p-3.5 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="font-display font-bold text-xs text-[#1A1A1A] leading-tight line-clamp-2 mb-1.5">
              {movie.title}
            </h3>
            <div className="flex flex-wrap gap-1 mb-2">
              {movie.genre?.slice(0, 2).map((g) => (
                <span key={g} className="badge-brand text-[9px] px-2 py-0.5 rounded-full font-medium">
                  {g}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[#6B7280] font-medium">
            <span className="flex items-center gap-0.5">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              {movie.imdbRating?.toFixed(1)}
            </span>
            <span className="flex items-center gap-0.5">
              <Clock size={12} className="text-[#6B7280]" />
              {formatDuration(movie.duration)}
            </span>
          </div>
          <div className="flex gap-1.5 mt-2">
            {movie.formats?.map((f) => (
              <span key={f} className="text-[9px] font-semibold px-1.5 py-0.5 rounded border border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280]">
                {f}
              </span>
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
      <div className="relative rounded-2xl overflow-hidden mb-2 shadow-sm border border-[#E5E7EB] bg-white aspect-[2/3]">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Rating badge */}
        <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/60 backdrop-blur-xs rounded-full px-2 py-0.5">
          <Star size={10} className="text-amber-400 fill-amber-400" />
          <span className="text-[10px] text-white font-bold">{movie.imdbRating?.toFixed(1)}</span>
        </div>

        {/* Play button hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#5B51DE]/15">
          <div className="bg-[#5B51DE] rounded-full p-2.5 shadow-md shadow-[#5B51DE]/30">
            <Play size={14} className="text-white fill-white" />
          </div>
        </div>

        {/* Coming soon overlay */}
        {movie.status === 'coming_soon' && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent py-2.5 px-2">
            <span className="badge-warning text-[9px] font-semibold">Coming Soon</span>
          </div>
        )}
      </div>

      <h3 className="font-display font-bold text-xs text-[#1A1A1A] leading-tight line-clamp-1 mb-1 group-hover:text-[#5B51DE] transition-colors">
        {movie.title}
      </h3>
      <div className="flex items-center gap-1.5 text-[10px] text-[#6B7280] font-medium">
        <span className="flex items-center gap-0.5">
          <Clock size={10} />
          {formatDuration(movie.duration)}
        </span>
        <span className="text-[#D1D5DB]">•</span>
        <span>{movie.formats?.[0] || '2D'}</span>
      </div>
    </button>
  );
};

export default MovieCard;
