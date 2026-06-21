import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  const bookings = useSelector(selectMyBookings);
  const { bookingsLoading, bookingsError } = useSelector((s) => s.booking);

  const load = async () => {
    dispatch(fetchBookingsStart());
    try {
      const res = await getMyBookings();
      dispatch(fetchBookingsSuccess(res.data.data));
    } catch (err) {
      dispatch(fetchBookingsFailure(err.message));
    }
  };

  useEffect(() => { load(); }, [dispatch]);

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

  const activeBookings = bookings.filter((b) => b.status === 'confirmed');
  const pastBookings = bookings.filter((b) => b.status !== 'confirmed');

  return (
    <div className="page-container">
      <Header
        title="My Tickets"
        showBack={false}
        rightAction={
          <button onClick={load} className="p-2 rounded-xl bg-dark-700 text-gray-400 hover:text-white transition-colors">
            <RefreshCw size={16} />
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
        <div className="flex flex-col items-center justify-center py-16 px-8">
          <div className="w-20 h-20 rounded-full bg-dark-700 flex items-center justify-center mb-4">
            <Ticket size={32} className="text-gray-600" />
          </div>
          <h3 className="font-display font-bold text-lg text-white mb-2">No Bookings Yet</h3>
          <p className="text-sm text-gray-500 text-center">Your tickets will appear here once you book a movie.</p>
        </div>
      )}

      {!bookingsLoading && activeBookings.length > 0 && (
        <div className="mt-4">
          <div className="px-5 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-gray-400">Active Bookings ({activeBookings.length})</span>
          </div>
          {activeBookings.map((booking) => (
            <TicketCard key={booking._id} booking={booking} onCancel={handleCancel} />
          ))}
        </div>
      )}

      {!bookingsLoading && pastBookings.length > 0 && (
        <div className="mt-4">
          <div className="px-5 mb-3">
            <span className="text-xs font-medium text-gray-500">Past Bookings ({pastBookings.length})</span>
          </div>
          {pastBookings.map((booking) => (
            <TicketCard key={booking._id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistoryPage;
