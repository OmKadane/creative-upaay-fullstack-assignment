import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Ticket, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import TicketCard from '../components/booking/TicketCard';
import { getMyBookings, cancelBooking } from '../services/bookingService';
import {
  fetchBookingsStart,
  fetchBookingsSuccess,
  fetchBookingsFailure,
  updateBookingInList,
  selectMyBookings,
} from '../store/slices/bookingSlice';

const BookingHistoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bookings = useSelector(selectMyBookings);
  const { bookingsLoading } = useSelector((s) => s.booking);
  const { user } = useSelector((s) => s.auth);

  const load = async () => {
    if (!user) return;
    dispatch(fetchBookingsStart());
    try {
      const res = await getMyBookings();
      dispatch(fetchBookingsSuccess(res.data.data));
    } catch (err) {
      dispatch(fetchBookingsFailure(err.message));
    }
  };

  useEffect(() => {
    if (user) {
      load();
    }
  }, [dispatch, user]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;
    try {
      const res = await cancelBooking(bookingId);
      dispatch(updateBookingInList(res.data.data));
      toast.success('Booking cancelled. Refund initiated.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancellation failed.');
    }
  };

  if (!user) {
    return (
      <div className="page-container bg-[#F7F8FD]">
        <Header title="My Tickets" showBack={false} />
        
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[#EEF0FF] border border-[#C7C3F7] flex items-center justify-center mb-4.5 shadow-sm">
            <Ticket size={28} className="text-[#5B51DE]" />
          </div>
          <h3 className="font-display font-bold text-sm text-[#1A1A1A] mb-1.5">Sign In Required</h3>
          <p className="text-xs text-[#6B7280] font-semibold max-w-[220px] leading-relaxed">
            Please log in or create a new account to view your booked tickets.
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

  const activeBookings = bookings.filter((b) => b.status === 'confirmed');
  const pastBookings = bookings.filter((b) => b.status !== 'confirmed');

  return (
    <div className="page-container bg-[#F7F8FD]">
      <Header
        title="My Tickets"
        showBack={false}
        rightAction={
          <button onClick={load} className="p-2 rounded-xl bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#5B51DE] transition-colors shadow-sm active:scale-95">
            <RefreshCw size={15} />
          </button>
        }
      />

      {bookingsLoading && (
        <div className="px-5 space-y-4 mt-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="skeleton h-52 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {!bookingsLoading && bookings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#EEF0FF] border border-[#C7C3F7] flex items-center justify-center mb-4.5 shadow-sm">
            <Ticket size={28} className="text-[#5B51DE]" />
          </div>
          <h3 className="font-display font-bold text-sm text-[#1A1A1A] mb-1.5">No Bookings Yet</h3>
          <p className="text-xs text-[#6B7280] font-semibold max-w-[220px] leading-relaxed">
            Your tickets will appear here once you book a movie.
          </p>
          <button onClick={() => navigate('/')} className="btn-brand mt-5 py-2.5 text-xs px-5 shadow-md shadow-[#5B51DE]/25">
            Find Movies
          </button>
        </div>
      )}

      {!bookingsLoading && activeBookings.length > 0 && (
        <div className="mt-4">
          <div className="px-5 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Active Bookings ({activeBookings.length})</span>
          </div>
          {activeBookings.map((booking) => (
            <div key={booking._id} onClick={() => navigate(`/ticket/${booking._id}`)} className="cursor-pointer">
              <TicketCard booking={booking} onCancel={handleCancel} />
            </div>
          ))}
        </div>
      )}

      {!bookingsLoading && pastBookings.length > 0 && (
        <div className="mt-6 pb-20">
          <div className="px-5 mb-3">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Past Bookings ({pastBookings.length})</span>
          </div>
          {pastBookings.map((booking) => (
            <div key={booking._id} onClick={() => navigate(`/ticket/${booking._id}`)} className="cursor-pointer opacity-70">
              <TicketCard booking={booking} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistoryPage;
