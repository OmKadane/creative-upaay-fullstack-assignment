import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreVertical } from 'lucide-react';

const Header = ({ title, showBack = true, rightAction = null, transparent = false }) => {
  const navigate = useNavigate();

  return (
    <header className={`sticky top-0 z-40 flex items-center justify-between px-5 py-4 ${
      transparent ? 'bg-transparent' : 'glass border-b border-dark-600/30'
    }`}>
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-dark-700/60 text-gray-300 hover:text-white hover:bg-dark-600 transition-all duration-150 active:scale-95"
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {title && (
          <h1 className="text-lg font-display font-bold text-white truncate max-w-[220px]">
            {title}
          </h1>
        )}
      </div>

      {rightAction && (
        <div>{rightAction}</div>
      )}
    </header>
  );
};

export default Header;
