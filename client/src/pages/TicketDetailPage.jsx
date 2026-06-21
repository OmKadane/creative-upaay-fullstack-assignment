import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import TicketCard from '../components/booking/TicketCard';
import { getBookingById, cancelBooking } from '../services/bookingService';
import { updateBookingInList } from '../store/slices/bookingSlice';

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getBookingById(id);
      setBooking(res.data.data);
    } catch (err) {
      toast.error('Failed to load ticket details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;
    try {
      const res = await cancelBooking(bookingId);
      setBooking(res.data.data);
      dispatch(updateBookingInList(res.data.data));
      toast.success('Booking cancelled. Refund initiated.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancellation failed.');
    }
  };

  return (
    <div className="page-container bg-[#F7F8FD]">
      <Header
        title="Ticket Details"
        rightAction={
          <button onClick={load} className="p-2 rounded-xl bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#5B51DE] transition-colors shadow-sm active:scale-95">
            <RefreshCw size={15} />
          </button>
        }
      />

      {loading ? (
        <div className="px-5 space-y-4 mt-6">
          <div className="skeleton h-64 w-full rounded-2xl" />
        </div>
      ) : !booking ? (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
          <p className="text-3xl mb-2">🎟️</p>
          <h3 className="font-display font-bold text-sm text-[#1A1A1A]">Ticket Not Found</h3>
          <p className="text-xs text-[#6B7280] mt-1">We couldn't retrieve details for this ticket code.</p>
          <button className="btn-brand mt-4" onClick={() => navigate('/')}>Go Home</button>
        </div>
      ) : (
        <div className="mt-5">
          <TicketCard booking={booking} onCancel={handleCancel} />
        </div>
      )}
    </div>
  );
};

export default TicketDetailPage;
