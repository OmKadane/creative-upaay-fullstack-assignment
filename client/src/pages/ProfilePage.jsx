import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Film, Ticket, Settings, LogOut, ChevronRight, User as UserIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { selectUser } from '../store/slices/authSlice';
import { getInitials } from '../utils/helpers';
import Header from '../components/layout/Header';

const MenuRow = ({ icon: Icon, label, sublabel, onClick, danger = false }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 py-3.5 px-4 rounded-xl hover:bg-dark-700 active:scale-98 transition-all duration-150"
  >
    <div className={`p-2 rounded-xl ${danger ? 'bg-red-500/10' : 'bg-brand-500/10'}`}>
      <Icon size={16} className={danger ? 'text-red-400' : 'text-brand-400'} />
    </div>
    <div className="flex-1 text-left">
      <p className={`text-sm font-medium ${danger ? 'text-red-400' : 'text-white'}`}>{label}</p>
      {sublabel && <p className="text-[10px] text-gray-500">{sublabel}</p>}
    </div>
    <ChevronRight size={14} className="text-gray-600" />
  </button>
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { signOut, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="page-container flex flex-col items-center justify-center px-8 gap-4">
        <div className="w-20 h-20 rounded-full bg-dark-700 flex items-center justify-center">
          <UserIcon size={32} className="text-gray-600" />
        </div>
        <h2 className="font-display font-bold text-xl text-white">Sign In to CineBook</h2>
        <p className="text-sm text-gray-400 text-center">Access your tickets, bookings, and profile.</p>
        <button className="btn-brand w-full" onClick={() => navigate('/login')}>Sign In</button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header title="Profile" showBack={false} />

      {/* Avatar card */}
      <div className="mx-5 my-4 card p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-display font-bold text-xl shadow-brand">
          {getInitials(user?.name)}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-bold text-lg text-white truncate">{user?.name}</h2>
          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          <span className="badge-brand text-[9px] mt-1">{user?.role || 'Member'}</span>
        </div>
      </div>

      {/* Menu */}
      <div className="mx-5 card p-2 space-y-0.5">
        <MenuRow
          icon={Ticket}
          label="My Bookings"
          sublabel="View your active & past tickets"
          onClick={() => navigate('/bookings')}
        />
        <MenuRow
          icon={Film}
          label="Browse Movies"
          sublabel="Discover what's showing"
          onClick={() => navigate('/movies')}
        />
        <MenuRow
          icon={Settings}
          label="Settings"
          sublabel="Notifications, preferences"
          onClick={() => {}}
        />
      </div>

      {/* Logout */}
      <div className="mx-5 mt-3 card p-2">
        <MenuRow icon={LogOut} label="Sign Out" danger onClick={signOut} />
      </div>

      {/* App version */}
      <p className="text-center text-[10px] text-gray-700 mt-6 pb-4">CineBook v1.0.0 · Built with ❤️</p>
    </div>
  );
};

export default ProfilePage;
