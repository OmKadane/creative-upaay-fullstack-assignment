import { useNavigate } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';
import { formatDuration } from '../../utils/helpers';
import starIcon from '../../assets/star.svg';

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
      className="flex-shrink-0 w-[106px] h-auto text-left group animate-fade-in active:scale-95 transition-transform duration-150 flex flex-col gap-[5px]"
    >
      <div
        className="relative overflow-hidden shadow-sm border border-[#E5E7EB] bg-white w-[106px] h-[158px] rounded-[5px]"
        style={{ transform: 'translate3d(0, 0, 0)' }}
      >
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          style={{
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
            willChange: 'transform',
          }}
          loading="lazy"
        />

        {/* Rating badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '50.52px',
            height: '21.91px',
            backgroundColor: '#080325',
            borderTopLeftRadius: '5px',
            borderBottomRightRadius: '5px',
            borderTopRightRadius: '0px',
            borderBottomLeftRadius: '0px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: '35px',
              height: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxSizing: 'border-box',
            }}
          >
            <img src={starIcon} alt="Star" className="w-[11px] h-[11px] flex-shrink-0" />
            <span className="text-[10px] text-[#F7F8FD] font-bold leading-none whitespace-nowrap">
              {movie.imdbRating?.toFixed(1) || '4.5'}
            </span>
          </div>
        </div>
      </div>

      <h3 className="font-sans font-semibold text-[14px] leading-[1.34] text-[#454545] w-[102px] line-clamp-2 group-hover:text-[#5B51DE] transition-colors">
        {movie.title}
      </h3>
      <p className="font-sans font-normal text-[12px] leading-[15px] text-[#454545] w-[102px] line-clamp-2">
        {movie.genre?.map(g => g === 'Sci-Fi' ? 'Sci-fi' : g).join(', ')}
      </p>
    </button>
  );
};

export default MovieCard;
