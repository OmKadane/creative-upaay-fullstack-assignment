import { NavLink, useLocation } from 'react-router-dom';
import { Home, Ticket, Heart, User } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/tickets', label: 'Tickets', icon: Ticket },
  { path: '/favorites', label: 'Favorites', icon: Heart },
  { path: '/profile', label: 'Profile', icon: User },
];

const BottomNav = () => {
  const location = useLocation();

  // Bottom navbar is temporarily kept fully visible on all routes (including login)
  // to allow easy click-throughs and testing of all screens without the auth wall.

  return (
    <nav className="absolute bottom-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(path);

          return (
            <NavLink
              key={path}
              to={path}
              className="flex items-center justify-center transition-all duration-200"
            >
              <div className={`p-2.5 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'bg-[#EEF0FF] text-[#5B51DE]'
                  : 'text-[#9CA3AF] hover:text-[#6B7280]'
              }`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
