import { NavLink, useLocation } from 'react-router-dom';
import { Home, Film, Clock, User } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/movies', label: 'Movies', icon: Film },
  { path: '/bookings', label: 'My Tickets', icon: Clock },
  { path: '/profile', label: 'Profile', icon: User },
];

const BottomNav = () => {
  const location = useLocation();

  // Hide bottom nav on checkout/seat pages for immersive experience
  const hiddenPaths = ['/checkout', '/seat-selection'];
  if (hiddenPaths.some((p) => location.pathname.startsWith(p))) return null;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile z-50 nav-glow glass border-t border-dark-600/50">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(path);

          return (
            <NavLink
              key={path}
              to={path}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-0"
            >
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-brand-500/20 text-brand-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span className={`text-[10px] font-medium transition-colors duration-200 ${
                isActive ? 'text-brand-400' : 'text-gray-500'
              }`}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
