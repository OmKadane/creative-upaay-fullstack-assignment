import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const Header = ({ title, showBack = true, rightAction = null, transparent = false }) => {
  const navigate = useNavigate();

  return (
    <header className={`sticky top-0 z-40 flex items-center justify-between px-5 py-4 ${
      transparent ? 'bg-transparent' : 'bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-sm'
    }`}>
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white border border-[#E5E7EB] text-[#1A1A1A] hover:bg-[#F9FAFB] transition-all duration-150 active:scale-95 shadow-sm"
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {title && (
          <h1 className="text-base font-display font-bold text-[#1A1A1A] truncate max-w-[220px]">
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
