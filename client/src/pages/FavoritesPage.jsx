import { Heart } from 'lucide-react';
import Header from '../components/layout/Header';

const FavoritesPage = () => {
  return (
    <div className="page-container bg-[#F7F8FD]">
      <Header title="Favorites" showBack={false} />
      
      <div className="flex flex-col items-center justify-center py-20 px-8 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-[#FFF5F5] border border-[#FEB2B2] flex items-center justify-center mb-4.5 shadow-sm">
          <Heart size={28} className="text-[#F56565]" fill="#F56565" />
        </div>
        <h3 className="font-display font-bold text-sm text-[#1A1A1A] mb-1.5">Your Favorite Movies</h3>
        <p className="text-xs text-[#6B7280] font-semibold max-w-[220px] leading-relaxed">
          Keep track of movies you want to watch. Tap the heart icon on any movie detail page to save it here.
        </p>
      </div>
    </div>
  );
};

export default FavoritesPage;
