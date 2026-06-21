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
    <div className="skeleton w-full aspect-[2/3] rounded-2xl mb-2" />
    <div className="skeleton h-3 w-3/4 mb-1 rounded" />
    <div className="skeleton h-2 w-1/2 rounded" />
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
    <div className="page-container">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <div>
          <p className="text-xs text-gray-500 font-medium">📍 Mumbai, IN</p>
          <h1 className="text-xl font-display font-bold text-white mt-0.5">
            What's <span className="gradient-text">Playing?</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-xl bg-dark-700 text-gray-400 hover:text-white transition-colors">
            <Bell size={18} />
          </button>
          <button
            onClick={() => navigate('/search')}
            className="p-2.5 rounded-xl bg-dark-700 text-gray-400 hover:text-white transition-colors"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Featured banner */}
      {featuredMovie && !loading && (
        <button
          onClick={() => navigate(`/movies/${featuredMovie._id}`)}
          className="relative mx-5 mb-6 rounded-3xl overflow-hidden h-48 w-[calc(100%-2.5rem)] active:scale-98 transition-transform"
        >
          <img
            src={featuredMovie.bannerUrl || featuredMovie.posterUrl}
            alt={featuredMovie.title}
            className="w-full h-full object-cover"
          />
          <div className="banner-gradient absolute inset-0" />
          <div className="absolute bottom-0 left-0 p-4">
            <span className="badge-brand text-[10px] mb-2 block w-fit">🔥 Featured</span>
            <h2 className="font-display font-bold text-white text-lg leading-tight">
              {featuredMovie.title}
            </h2>
            <p className="text-xs text-gray-300 mt-0.5">
              {featuredMovie.genre?.slice(0, 2).join(' • ')}
            </p>
          </div>
          <div className="absolute top-3 right-3">
            <span className="badge-brand text-[10px]">⭐ {featuredMovie.imdbRating?.toFixed(1)}</span>
          </div>
        </button>
      )}

      {/* Tab selector */}
      <div className="flex gap-2 mx-5 mb-5 bg-dark-700/50 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab('now')}
          className={activeTab === 'now' ? 'tab-active' : 'tab-inactive'}
        >
          Now Showing
        </button>
        <button
          onClick={() => setActiveTab('soon')}
          className={activeTab === 'soon' ? 'tab-active' : 'tab-inactive'}
        >
          Coming Soon
        </button>
      </div>

      {/* Movie grid */}
      <div className="scroll-x flex gap-3 px-5 mb-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : (activeTab === 'now' ? nowShowing : comingSoon).map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
        {!loading && activeTab === 'now' && nowShowing.length === 0 && (
          <p className="text-gray-500 text-sm py-8 text-center w-full">No movies showing right now.</p>
        )}
      </div>

      {/* Trending section */}
      <div className="mb-6">
        <div className="section-header">
          <span className="section-title flex items-center gap-2">
            <TrendingUp size={18} className="text-brand-400" />
            Trending
          </span>
        </div>
        <div className="flex flex-col gap-3 px-5">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
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
          <span className="section-title">Nearby Theatres</span>
          <button className="text-xs text-brand-400 font-medium" onClick={() => navigate('/theaters')}>See all</button>
        </div>
        <div className="scroll-x flex gap-3 px-5">
          {['PVR: Phoenix', 'INOX: Lido', 'Cinepolis', 'Miraj'].map((name, i) => (
            <div key={i} className="flex-shrink-0 card p-3 w-44">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center mb-2">
                <MapPin size={16} className="text-brand-400" />
              </div>
              <p className="text-xs font-semibold text-white leading-tight mb-0.5">{name}</p>
              <p className="text-[10px] text-gray-500">From ₹{200 + i * 50} · 2D/3D</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
