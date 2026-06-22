import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../components/movie/MovieCard';
import heroPoster from '../assets/Meg-2-The-Trench-Hero-Poster.svg';
import searchIcon from '../assets/search.svg';
import meg2Poster from '../assets/Meg-2-The-Trench-Poster.svg';
import nun2Poster from '../assets/The-Nun-II-Poster.svg';
import fastXPoster from '../assets/Fast-X-Poster.svg';
import johnWickPoster from '../assets/John-Wick-Chapter-4-Poster.svg';
import gladiator2Poster from '../assets/Gladiator-II-Poster.svg';
import alienRomulusPoster from '../assets/Alien-Romulus-Poster.svg';
import dunePartTwoPoster from '../assets/Dune-Part-Two-Poster.svg';
import deadpoolWolverinePoster from '../assets/Deadpool-Wolverine-Poster.svg';
import movieTheatre1Poster from '../assets/Movie-Theatre-1-Poster.svg';
import movieTheatre2Poster from '../assets/Movie-Theatre-2-Poster.svg';
import movieTheatre3Poster from '../assets/Movie-Theatre-3-Poster.svg';
import locationIcon from '../assets/location.svg';
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
  <div className="flex-shrink-0 w-[106px] h-auto flex flex-col gap-[5px]">
    <div className="skeleton w-[106px] h-[158px] rounded-[5px]" />
    <div className="skeleton h-3.5 w-3/4 rounded" />
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

  const displayedMovies = [];
  if (activeTab === 'now') {
    for (let i = 0; i < 4; i++) {
      const dbMovie = nowShowing[i] || {};
      if (i === 0) {
        displayedMovies.push({
          ...dbMovie,
          title: 'Meg 2: The Trench',
          genre: ['Action', 'Sci-Fi', 'Horror'],
          imdbRating: 4.5,
          posterUrl: meg2Poster
        });
      } else if (i === 1) {
        displayedMovies.push({
          ...dbMovie,
          title: 'The Nun II',
          genre: ['Horror'],
          imdbRating: 4.5,
          posterUrl: nun2Poster
        });
      } else if (i === 2) {
        displayedMovies.push({
          ...dbMovie,
          title: 'Fast X',
          genre: ['Action', 'Adventure'],
          imdbRating: 4.5,
          posterUrl: fastXPoster
        });
      } else if (i === 3) {
        displayedMovies.push({
          ...dbMovie,
          title: 'John Wick: Chapter 4',
          genre: ['Action', 'Thriller'],
          imdbRating: 4.5,
          posterUrl: johnWickPoster
        });
      }
    }
  } else {
    const g2Db = comingSoon.find(m => m.title.toLowerCase().includes('gladiator')) || {};
    const alienDb = comingSoon.find(m => m.title.toLowerCase().includes('alien')) || {};
    const duneDb = nowShowing.find(m => m.title.toLowerCase().includes('dune')) || {};
    const dpDb = nowShowing.find(m => m.title.toLowerCase().includes('deadpool')) || {};

    displayedMovies.push({
      ...g2Db,
      title: 'Gladiator II',
      genre: ['Action', 'Adventure'],
      imdbRating: 4.5,
      posterUrl: gladiator2Poster,
      status: 'coming_soon'
    });
    displayedMovies.push({
      ...alienDb,
      title: 'Alien: Romulus',
      genre: ['Horror', 'Sci-Fi', 'Thriller'],
      imdbRating: 4.5,
      posterUrl: alienRomulusPoster,
      status: 'coming_soon'
    });
    displayedMovies.push({
      ...duneDb,
      title: 'Dune: Part Two',
      genre: ['Sci-Fi', 'Adventure'],
      imdbRating: 4.5,
      posterUrl: dunePartTwoPoster,
      status: 'coming_soon'
    });
    displayedMovies.push({
      ...dpDb,
      title: 'Deadpool & Wolverine',
      genre: ['Action', 'Comedy'],
      imdbRating: 4.5,
      posterUrl: deadpoolWolverinePoster,
      status: 'coming_soon'
    });
  }

  return (
    <div className="page-container bg-[#F7F8FD] !pt-0 !pb-[85px]">
      {/* Hero Poster Header */}
      <div
        className="relative overflow-hidden mb-6"
        style={{
          width: '390px',
          height: '220px',
        }}
      >
        <img
          src={heroPoster}
          alt="Meg 2: The Trench"
          className="w-full h-full object-cover"
        />
        {/* Search Icon */}
        <button
          onClick={() => navigate('/search')}
          className="absolute"
          style={{
            width: '28px',
            height: '28px',
            top: '39px',
            left: '340px',
            padding: 0,
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <img src={searchIcon} alt="Search" className="w-full h-full" />
        </button>
      </div>

      {/* Tab selector and View All */}
      <div
        className="flex items-center justify-between"
        style={{
          width: '416px',
          height: '24px',
          marginLeft: '-26px',
          paddingLeft: '52px',
          paddingRight: '25px',
          boxSizing: 'border-box',
        }}
      >
        <div className="flex gap-5 h-full items-center">
          <button
            onClick={() => setActiveTab('now')}
            className={`relative h-full pb-1 text-[12px] font-bold transition-all duration-200 ${activeTab === 'now'
              ? 'text-[#4F46E5]'
              : 'text-[#64748B] hover:text-[#4F46E5]'
              }`}
          >
            Now Showing
            {activeTab === 'now' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4F46E5]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('soon')}
            className={`relative h-full pb-1 text-[12px] font-bold transition-all duration-200 ${activeTab === 'soon'
              ? 'text-[#4F46E5]'
              : 'text-[#64748B] hover:text-[#4F46E5]'
              }`}
          >
            Coming Soon
            {activeTab === 'soon' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4F46E5]" />
            )}
          </button>
        </div>
        <button
          onClick={() => navigate('/movies')}
          style={{
            padding: 0,
            border: 'none',
            background: 'none',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: '12px',
            lineHeight: '100%',
            letterSpacing: '0%',
            color: '#4F46E5',
            width: '45px',
            height: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          View All
        </button>
      </div>

      {/* Movie grid — Frame 9: width 390px, height 240px, top 39px, left -26px */}
      <div
        style={{
          width: '416px',
          height: '240px',
          marginTop: '15px',
          marginLeft: '-26px',
          marginBottom: '24px',
          overflowX: 'auto',
          overflowY: 'hidden',
          display: 'flex',
          gap: '9px',
          paddingLeft: '52px',
          paddingRight: '26px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          boxSizing: 'border-box',
        }}
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : displayedMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        {!loading && displayedMovies.length === 0 && (
          <p className="text-[#6B7280] text-sm py-8 text-center w-full">No movies found in this category.</p>
        )}
      </div>
      {/* Movie Theatres section */}
      <div
        style={{
          width: '339px',
          height: 'auto',
          marginLeft: '26px',
          marginTop: '19px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '338px',
            height: '19px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
          }}
          className="mb-4"
        >
          <h2
            style={{
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '100%',
              letterSpacing: '0%',
              color: '#454545',
              width: '122px',
              height: '19px',
            }}
          >
            Movie Theatres
          </h2>
          <button
            onClick={() => navigate('/theaters')}
            style={{
              padding: 0,
              border: 'none',
              background: 'none',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '100%',
              letterSpacing: '0%',
              color: '#4F46E5',
              width: '45px',
              height: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            View All
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {[
            {
              name: 'The Grandview',
              location: 'Camp Aguinaldo, Quezon City',
              price: '₹320 - ₹450',
              logo: (
                <img
                  src={movieTheatre1Poster}
                  alt="The Grandview Logo"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )
            },
            {
              name: 'Play Loft',
              location: 'Aurora Boulevard, Santa Mesa',
              price: '₹300 - ₹430',
              logo: (
                <img
                  src={movieTheatre2Poster}
                  alt="Play Loft Logo"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )
            },
            {
              name: 'CinemaOne',
              location: 'A Cruz, Pasay City',
              price: '₹320',
              logo: (
                <img
                  src={movieTheatre3Poster}
                  alt="CinemaOne Logo"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )
            }
          ].map((theatre, i) => (
            <div
              key={i}
              style={{
                width: '338px',
                height: '73px',
                position: 'relative',
                left: '1px',
                boxSizing: 'border-box',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '73px',
                  height: '73px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {theatre.logo}
              </div>
              <p
                className="truncate"
                style={{
                  position: 'absolute',
                  left: '85px',
                  top: '4px',
                  width: theatre.name === 'The Grandview' ? '103px' : theatre.name === 'Play Loft' ? '60px' : '80px',
                  height: '17px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  margin: 0,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: '600',
                  fontSize: '14px',
                  color: '#121212',
                  opacity: 1,
                }}
              >
                {theatre.name}
              </p>
              <div
                style={{
                  position: 'absolute',
                  left: '85px',
                  top: '26px',
                  height: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <img
                  src={locationIcon}
                  style={{
                    width: '11px',
                    height: '14px',
                    opacity: 1,
                    transform: 'rotate(0deg)',
                    flexShrink: 0,
                  }}
                  alt="location"
                />
                <span
                  style={{
                    display: 'inline-block',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '400',
                    fontSize: '12px',
                    lineHeight: '1',
                    letterSpacing: '0%',
                    color: '#64748B',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {theatre.location}
                </span>
              </div>
              <p
                className="truncate"
                style={{
                  position: 'absolute',
                  left: '85px',
                  top: '50px',
                  width: theatre.name === 'The Grandview' ? '84px' : theatre.name === 'Play Loft' ? '85px' : '84px',
                  height: '17px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  margin: 0,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: '600',
                  fontSize: '14px',
                  color: '#64748B',
                  opacity: 1,
                }}
              >
                {theatre.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
