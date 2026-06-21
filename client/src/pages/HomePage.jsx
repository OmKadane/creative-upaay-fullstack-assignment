import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Bell, TrendingUp } from 'lucide-react';
import MovieCard from '../components/movie/MovieCard';
import {
  fetchMoviesStart,
  fetchMoviesSuccess,
  fetchMoviesFailure,
  selectNowShowing,
  selectComingSoon,
  selectMoviesLoading,
} from '../store/slices/movieSlice';
import { getMovies } from '../services/movieService';

const SkeletonCard = () => (
  <div className="flex-shrink-0 w-36">
    <div className="skeleton w-full aspect-[2/3] rounded-2xl mb-2.5" />
    <div className="skeleton h-3.5 w-3/4 mb-1.5 rounded" />
    <div className="skeleton h-2.5 w-1/2 rounded" />
  </div>
);

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const nowShowing = useSelector(selectNowShowing);
  const comingSoon = useSelector(selectComingSoon);
  const loading = useSelector(selectMoviesLoading);
  const [activeTab, setActiveTab] = useState('now');

  useEffect(() => {
    const loadMovies = async () => {
      dispatch(fetchMoviesStart());
      try {
        const res = await getMovies();
        dispatch(fetchMoviesSuccess(res.data.data));
      } catch (err) {
        dispatch(fetchMoviesFailure(err.message));
      }
    };
    loadMovies();
  }, [dispatch]);

  const featuredMovie = nowShowing[0];

  return (
    <div className="page-container bg-[#F7F8FD]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <div>
          <p className="text-[11px] text-[#6B7280] font-semibold tracking-wide uppercase flex items-center gap-1">
            <MapPin size={10} className="text-[#5B51DE]" /> Mumbai, IN
          </p>
          <h1 className="text-[22px] font-display font-bold text-[#1A1A1A] mt-0.5">
            What's <span className="text-[#5B51DE]">Playing?</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#5B51DE] transition-colors shadow-sm active:scale-95">
            <Bell size={18} />
          </button>
          <button
            onClick={() => navigate('/search')}
            className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#5B51DE] transition-colors shadow-sm active:scale-95"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Featured banner */}
      {featuredMovie && !loading && (
        <button
          onClick={() => navigate(`/movies/${featuredMovie._id}`)}
          className="relative mx-5 mb-6 rounded-3xl overflow-hidden h-52 w-[calc(100%-2.5rem)] active:scale-98 transition-transform text-left bg-white border border-[#E5E7EB] shadow-sm flex flex-col justify-between"
        >
          <div className="h-[60%] w-full relative">
            <img
              src={featuredMovie.bannerUrl || featuredMovie.posterUrl}
              alt={featuredMovie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3">
              <span className="bg-[#1A1A1A]/75 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                ⭐ {featuredMovie.imdbRating?.toFixed(1)}
              </span>
            </div>
          </div>
          <div className="p-4 h-[40%] flex flex-col justify-center">
            <span className="badge-brand text-[9px] mb-1.5 w-fit">🔥 Featured</span>
            <h2 className="font-display font-bold text-[#1A1A1A] text-sm leading-tight truncate">
              {featuredMovie.title}
            </h2>
            <p className="text-[11px] text-[#6B7280] mt-0.5">
              {featuredMovie.genre?.slice(0, 2).join(' • ')} · {featuredMovie.rating}
            </p>
          </div>
        </button>
      )}

      {/* Tab selector */}
      <div className="flex gap-2 mx-5 mb-5 bg-white border border-[#E5E7EB] p-1 rounded-2xl shadow-sm">
        <button
          onClick={() => setActiveTab('now')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
            activeTab === 'now'
              ? 'bg-[#5B51DE] text-white shadow'
              : 'text-[#6B7280] hover:text-[#1A1A1A]'
          }`}
        >
          Now Showing
        </button>
        <button
          onClick={() => setActiveTab('soon')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
            activeTab === 'soon'
              ? 'bg-[#5B51DE] text-white shadow'
              : 'text-[#6B7280] hover:text-[#1A1A1A]'
          }`}
        >
          Coming Soon
        </button>
      </div>

      {/* Movie grid */}
      <div className="scroll-x flex gap-4.5 px-5 mb-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : (activeTab === 'now' ? nowShowing : comingSoon).map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
        {!loading && (activeTab === 'now' ? nowShowing : comingSoon).length === 0 && (
          <p className="text-[#6B7280] text-sm py-8 text-center w-full">No movies found in this category.</p>
        )}
      </div>

      {/* Trending section */}
      <div className="mb-6">
        <div className="section-header">
          <span className="section-title flex items-center gap-2 text-[#1A1A1A]">
            <TrendingUp size={18} className="text-[#5B51DE]" />
            Trending
          </span>
        </div>
        <div className="flex flex-col gap-3 px-5">
          {loading
            ? Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="skeleton h-24 w-full rounded-2xl" />
              ))
            : nowShowing.slice(1, 4).map((movie) => (
                <MovieCard key={movie._id} movie={movie} variant="landscape" />
              ))}
        </div>
      </div>

      {/* Theatre section */}
      <div className="mb-6">
        <div className="section-header">
          <span className="section-title text-[#1A1A1A]">Nearby Theatres</span>
          <button className="text-xs text-[#5B51DE] font-semibold hover:underline" onClick={() => navigate('/theaters')}>
            See all
          </button>
        </div>
        <div className="scroll-x flex gap-3.5 px-5">
          {['PVR: Phoenix Mall', 'INOX: Lido Mall', 'Cinepolis: Nexus', 'Miraj Cinemas'].map((name, i) => (
            <div key={i} className="flex-shrink-0 card p-4 w-44 bg-white border border-[#E5E7EB] shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-[#EEF0FF] flex items-center justify-center mb-3">
                <MapPin size={16} className="text-[#5B51DE]" />
              </div>
              <p className="text-xs font-bold text-[#1A1A1A] leading-tight mb-1 truncate">{name}</p>
              <p className="text-[10px] text-[#6B7280]">From ₹{200 + i * 50} · 2D/3D</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
