import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, Ticket } from 'lucide-react';
import { getBookingById } from '../services/bookingService';
import Header from '../components/layout/Header';
import { formatDate, formatCurrency } from '../utils/helpers';

const PaymentSuccessPage = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const res = await getBookingById(reservationId);
        setBooking(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadBooking();
  }, [reservationId]);

  if (loading) {
    return (
      <div className="page-container bg-[#F7F8FD] flex flex-col items-center justify-center">
        <div className="w-9 h-9 rounded-full border-2 border-[#5B51DE] border-t-transparent animate-spin" />
        <p className="text-xs font-semibold text-[#6B7280] mt-3">Fetching confirmation details...</p>
      </div>
    );
  }

  return (
    <div className="page-container bg-[#F7F8FD]">
      <Header title="Payment Success" showBack={false} />

      <div className="flex flex-col items-center justify-center px-6 pt-8 pb-6 animate-fade-in text-center">
        {/* Animated Check */}
        <div className="w-16 h-16 rounded-full bg-[#E8F5E9] border border-[#A5D6A7] flex items-center justify-center mb-5 animate-bounce-soft">
          <CheckCircle size={32} className="text-emerald-600" />
        </div>

        <h1 className="font-display font-bold text-xl text-[#1A1A1A] mb-1.5">Payment Successful!</h1>
        <p className="text-[#6B7280] text-xs font-semibold max-w-[280px] leading-relaxed mb-6">
          Your booking is confirmed. We have sent the confirmation & digital ticket to your email.
        </p>

        {/* Short Summary Card */}
        {booking && (
          <div className="w-full bg-white border border-[#E5E7EB] rounded-2xl p-4.5 mb-8 shadow-sm text-left">
            <div className="flex gap-3.5 mb-3.5 pb-3 border-b border-[#E5E7EB]">
              {booking.movie?.posterUrl && (
                <img
                  src={booking.movie.posterUrl}
                  alt={booking.movie?.title}
                  className="w-12 h-18 object-cover rounded-xl border border-[#E5E7EB] shadow-sm flex-shrink-0"
                />
              )}
              <div className="min-w-0 flex flex-col justify-center">
                <h3 className="font-bold text-sm text-[#1A1A1A] truncate">{booking.bookingSnapshot?.movieTitle || booking.movie?.title}</h3>
                <p className="text-[10px] text-[#6B7280] font-semibold flex items-center gap-1 mt-1">
                  <MapPin size={11} className="text-[#5B51DE]" />
                  {booking.bookingSnapshot?.theaterName || booking.theater?.name}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[10px] font-bold text-[#6B7280] uppercase mb-4">
              <div>
                <span className="text-[#9CA3AF]">Date & Time</span>
                <p className="text-[#1A1A1A] font-bold mt-0.5">
                  {formatDate(booking.bookingSnapshot?.showDate)} · {booking.bookingSnapshot?.showTime}
                </p>
              </div>
              <div>
                <span className="text-[#9CA3AF]">Seats</span>
                <p className="text-[#1A1A1A] font-bold mt-0.5">
                  {booking.seats?.map((s) => s.seatId).join(', ')}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center bg-[#EEF0FF] p-3 rounded-xl border border-[#C7C3F7]/50">
              <span className="text-[10px] font-bold text-[#6B7280] uppercase">Total Paid</span>
              <span className="text-sm font-bold text-[#5B51DE]">{formatCurrency(booking.totalAmount)}</span>
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => navigate(`/ticket/${reservationId}`)}
            className="btn-brand w-full flex items-center justify-center gap-2 shadow-lg shadow-[#5B51DE]/25"
          >
            <Ticket size={16} />
            View Digital Ticket
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-ghost w-full"
          >
            Go back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
