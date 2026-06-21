import { User, LogOut, ChevronRight, Shield, Bell, HelpCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { logout } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const ProfileItem = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between py-3.5 px-4.5 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm hover:border-[#5B51DE] transition-all duration-150 active:scale-[0.99]"
  >
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-xl bg-[#EEF0FF] text-[#5B51DE]">
        <Icon size={16} />
      </div>
      <span className="text-xs font-bold text-[#1A1A1A]">{label}</span>
    </div>
    <ChevronRight size={15} className="text-[#9CA3AF]" />
  </button>
);

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="page-container bg-[#F7F8FD]">
        <Header title="My Profile" showBack={false} />
        
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[#EEF0FF] border border-[#C7C3F7] flex items-center justify-center mb-4.5 shadow-sm">
            <User size={28} className="text-[#5B51DE]" />
          </div>
          <h3 className="font-display font-bold text-sm text-[#1A1A1A] mb-1.5">Sign In Required</h3>
          <p className="text-xs text-[#6B7280] font-semibold max-w-[220px] leading-relaxed">
            Please log in or create a new account to view and manage your profile details.
          </p>
          <button 
            onClick={() => navigate('/login')} 
            className="btn-brand mt-5 py-3 px-6 shadow-md shadow-[#5B51DE]/25 font-bold rounded-xl bg-[#5B51DE] text-white hover:bg-[#4843C8] transition-all duration-150 active:scale-95 text-xs"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container bg-[#F7F8FD]">
      <Header title="My Profile" showBack={false} />

      {/* User Info Header */}
      <div className="mx-5 my-5 flex items-center gap-4 p-4.5 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
        <div className="w-14 h-14 rounded-full bg-[#EEF0FF] border-2 border-[#C7C3F7]/50 flex items-center justify-center text-[#5B51DE] font-bold text-lg shadow-sm">
          {user?.name?.slice(0, 2).toUpperCase() || 'U'}
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-[#1A1A1A] truncate">{user?.name || 'CineBook User'}</h2>
          <p className="text-[10px] text-[#6B7280] font-semibold truncate mt-0.5">{user?.email || 'user@cinebook.app'}</p>
        </div>
      </div>

      {/* Menu Options */}
      <div className="mx-5 space-y-3">
        <ProfileItem icon={Shield} label="Account Security" onClick={() => {}} />
        <ProfileItem icon={Bell} label="Notifications" onClick={() => {}} />
        <ProfileItem icon={HelpCircle} label="Help & Support" onClick={() => {}} />
      </div>

      {/* Logout button */}
      <div className="mx-5 mt-6">
        <button
          onClick={handleLogout}
          className="w-full py-3.5 rounded-2xl border border-red-200 text-red-500 hover:bg-red-50 text-xs font-bold transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 shadow-sm"
        >
          <LogOut size={15} />
          Sign Out Account
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
