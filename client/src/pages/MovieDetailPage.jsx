import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Star, Clock, Film, ChevronRight, Users, ChevronLeft, Heart } from 'lucide-react';
import { getMovieById } from '../services/movieService';
import { setSelectedMovie } from '../store/slices/bookingSlice';
import { formatDuration } from '../utils/helpers';
import meg2ScenePoster from '../assets/Meg-2-The-Trench-Scene-Poster.svg';
import cast1 from '../assets/Cast-1.jpg';
import cast2 from '../assets/Cast-2.jpg';
import cast3 from '../assets/Cast-3.jpg';
import cast4 from '../assets/Cast-4.png';

const MOVIE_OVERRIDES = {
  'meg 2: the trench': {
    title: 'Meg 2: The Trench',
    description: 'A research team encounters multiple threats while exploring the depths of the ocean, including a malevolent mining operation.',
    releaseDate: '10 June 2026',
    formats: ['2D', '3D'],
    rating: 'PG-13',
    imdbRating: 5.1,
    cast: [
      { name: 'Jason Statham', role: 'Jonas Taylor', photo: cast1 },
      { name: 'Jing Wu', role: 'Jiuming Zhang', photo: cast2 },
      { name: 'Shuya Sophia Cai', role: 'Meiying', photo: cast3 },
      { name: 'Cliff Curtis', role: 'Mac', photo: cast4 }
    ]
  },
  'the nun ii': {
    title: 'The Nun II',
    description: 'In 1956 France, a priest is murdered, and an evil is spreading. Sister Irene once again comes face-to-face with the demonic force Valak.',
    releaseDate: '8 September 2023',
    formats: ['2D'],
    rating: 'R',
    imdbRating: 6.4,
    cast: [
      { name: 'Taissa Farmiga', role: 'Sister Irene' },
      { name: 'Jonas Bloquet', role: 'Frenchie' },
      { name: 'Storm Reid', role: 'Sister Debra' }
    ]
  },
  'fast x': {
    title: 'Fast X',
    description: 'Dom Toretto and his family are targeted by the vengeful son of drug kingpin Hernan Reyes.',
    releaseDate: '19 May 2023',
    formats: ['2D', '3D', 'IMAX'],
    rating: 'PG-13',
    imdbRating: 7.0,
    cast: [
      { name: 'Vin Diesel', role: 'Dominic Toretto' },
      { name: 'Michelle Rodriguez', role: 'Letty Ortiz' },
      { name: 'Jason Momoa', role: 'Dante Reyes' }
    ]
  },
  'john wick: chapter 4': {
    title: 'John Wick: Chapter 4',
    description: 'John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy.',
    releaseDate: '24 March 2023',
    formats: ['2D', 'IMAX'],
    rating: 'R',
    imdbRating: 8.4,
    cast: [
      { name: 'Keanu Reeves', role: 'John Wick' },
      { name: 'Donnie Yen', role: 'Caine' },
      { name: 'Bill Skarsgård', role: 'Marquis' }
    ]
  }
};

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        let movieData = null;
        if (id && id !== 'meg-2') {
          const res = await getMovieById(id);
          movieData = res.data.data;
        }

        // Apply state overrides
        const stateMovie = location.state?.movie;
        if (stateMovie) {
          movieData = { ...movieData, ...stateMovie };
        }

        // Fallback for direct links / page refresh where state is lost
        if (!movieData && id === 'meg-2') {
          movieData = { title: 'Meg 2: The Trench' };
        }

        // Apply static overrides based on title
        const titleKey = movieData?.title?.toLowerCase();
        if (titleKey && MOVIE_OVERRIDES[titleKey]) {
          movieData = { ...movieData, ...MOVIE_OVERRIDES[titleKey] };
        }

        setMovie(movieData);
        if (movieData) {
          dispatch(setSelectedMovie(movieData));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, dispatch, location.state]);

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
    <div className="w-[390px] h-[846px] relative bg-slate-50 rounded-[5px] mx-auto overflow-hidden">
      {/* Hero Banner */}
      <img
        className="w-[390px] h-[196px] left-0 top-[-1px] absolute rounded-tl-[5px] rounded-tr-[5px] object-cover"
        src={movie.title.toLowerCase().includes('meg 2') ? meg2ScenePoster : (movie.bannerUrl || movie.posterUrl)}
        alt={movie.title}
      />

      {/* Floating Close text */}
      <button
        onClick={() => navigate(-1)}
        className="left-[32px] top-[21px] absolute justify-start text-slate-50 text-sm font-semibold font-['Inter'] cursor-pointer border-none bg-transparent p-0 outline-none"
      >
        Close
      </button>

      {/* Floating Heart Icon Overlay */}
      <button
        className="left-[340px] top-[21px] absolute bg-transparent border-none p-0 cursor-pointer outline-none"
      >
        <Heart size={20} className="text-[#F7F8FD] stroke-[2]" />
      </button>

      {/* Title */}
      <div className="w-[180px] left-[26px] top-[213px] absolute justify-start text-neutral-900 text-base font-semibold font-['Inter'] leading-5">
        {movie.title}
      </div>

      {/* PG-13 Badge */}
      <div className="h-[20px] px-[7px] left-[216px] top-[213px] absolute rounded-[5px] border border-[#2F81CD] inline-flex justify-center items-center gap-[10px] overflow-hidden">
        <div className="justify-start text-[#2F81CD] text-xs font-normal font-['Inter']">{movie.rating}</div>
      </div>

      {/* Rating Container */}
      <div className="left-[319px] top-[216px] h-[14px] absolute inline-flex items-center gap-[14px]">
        <Star size={14} className="text-[#080325] fill-[#080325] shrink-0" />
        <span className="text-[#080325] text-[14px] font-normal font-['Inter'] leading-none inline-flex items-center">
          {movie.imdbRating?.toFixed(1)}
        </span>
      </div>

      {/* Genre Row */}
      <div className="w-44 left-[26px] top-[238px] absolute justify-start text-slate-500 text-sm font-normal font-['Inter']">
        {movie.genre?.map(g => g === 'Sci-Fi' ? 'Sci-fi' : g).join(', ')}
      </div>

      {/* Description */}
      <div className="w-[338px] left-[26px] top-[273px] absolute justify-start text-[#64748B] text-[14px] font-normal font-['Inter']" style={{ lineHeight: '20.86px' }}>
        {movie.description}
      </div>

      {/* Format Available */}
      <div className="w-[131px] h-[62px] left-[26px] top-[358px] absolute inline-flex flex-col justify-start items-start gap-[12px]">
        <div className="self-stretch justify-start text-[#454545] text-base font-bold font-['Inter'] leading-[19px]">Format Available</div>
        <div className="flex justify-start items-center gap-[10px]">
          {movie.formats?.map((format) => (
            <div key={format} className="py-[8px] px-[10px] bg-[#F7F8FD] rounded-[5px] border border-[#CED6E0] flex justify-center items-center overflow-hidden">
              <div className="justify-start text-[#5B51DE] text-xs font-semibold font-['Inter']">{format}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Release Date */}
      <div className="w-[338px] h-12 left-[26px] top-[448px] absolute inline-flex flex-col justify-start items-start gap-2">
        <div className="self-stretch justify-start text-[#454545] text-[16px] font-bold font-['Inter'] leading-normal">Release Date</div>
        <div className="self-stretch justify-start text-[#64748B] text-[14px] font-normal font-['Inter']" style={{ lineHeight: '20.86px' }}>
          {movie.releaseDate instanceof Date
            ? movie.releaseDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
            : typeof movie.releaseDate === 'string' && movie.releaseDate.includes(' ')
              ? movie.releaseDate
              : movie.releaseDate
                ? new Date(movie.releaseDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                : 'N/A'}
        </div>
      </div>

      {/* Cast */}
      <div className="w-[37px] h-[19px] left-[26px] top-[524px] absolute justify-start text-[#454545] text-[16px] font-bold font-['Inter'] leading-normal">Cast</div>
      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div
        className="w-[390px] h-[72px] left-0 top-[558px] absolute overflow-x-auto scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="w-[600px] h-[72px] relative">
          {movie.cast?.map((member, i) => (
            <div key={i} className="absolute inline-flex justify-start items-start gap-[9px] w-[140px] h-[53px]" style={{ left: `${21 + i * 142}px`, top: '0px' }}>
              <img className="w-[52px] h-[52px] rounded-[5px] object-cover" src={member.photo || "https://placehold.co/52x52"} alt={member.name} />
              <div className="w-[79px] inline-flex flex-col justify-start items-start gap-1">
                <div className="self-stretch text-[#121212] text-[14px] font-normal font-['Inter'] leading-[17px] whitespace-normal line-clamp-2">{member.name}</div>
                <div className="self-stretch text-[#64748B] text-[12px] font-normal font-['Inter'] leading-[15px] whitespace-normal line-clamp-2">{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Get Tickets CTA */}
      {movie.status !== 'coming_soon' ? (
        <button
          onClick={() => navigate(`/select-theatre/${movie._id}`)}
          className="w-[345px] h-[37px] py-[10px] px-[39px] left-[21px] top-[655px] absolute bg-[#4F46E5] rounded-[5px] inline-flex justify-center items-center gap-[10px] overflow-hidden cursor-pointer border-none outline-none text-white text-[14px] font-semibold font-['Inter'] leading-normal active:scale-95 transition-transform"
        >
          Get Tickets
        </button>
      ) : (
        <button
          disabled
          className="w-[345px] h-[37px] py-[10px] px-[39px] left-[21px] top-[655px] absolute bg-slate-300 rounded-[5px] inline-flex justify-center items-center gap-[10px] overflow-hidden border-none outline-none text-slate-500 text-[14px] font-semibold font-['Inter'] leading-normal"
        >
          Coming Soon
        </button>
      )}

    </div>
  );
};

export default MovieDetailPage;
