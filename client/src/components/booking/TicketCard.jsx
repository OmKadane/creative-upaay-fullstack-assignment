import { QRCodeSVG as QRCode } from 'qrcode.react';
import { Calendar, Clock } from 'lucide-react';
import locationIcon from '../../assets/location.svg';
import { formatDate, formatCurrency } from '../../utils/helpers';

const TicketCard = ({ booking, onCancel }) => {
  const isActive = booking.status === 'confirmed';
  const isCancelled = booking.status === 'cancelled';

  const qrData = JSON.stringify({
    code: booking.bookingCode,
    movie: booking.bookingSnapshot?.movieTitle,
    seats: booking.seats?.map((s) => s.seatId).join(','),
  });

  return (
    <div className={`bg-white border border-[#E5E7EB] rounded-2xl shadow-sm animate-slide-up mx-4 mb-4 overflow-hidden ${isCancelled ? 'opacity-60' : ''}`}>
      {/* Top section — movie info */}
      <div className="p-4.5 pb-0">
        <div className="flex gap-4">
          {booking.movie?.posterUrl && (
            <img
              src={booking.movie.posterUrl}
              alt={booking.movie?.title}
              className="w-14 h-20 object-cover rounded-xl border border-[#E5E7EB] flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-display font-bold text-sm text-[#1A1A1A] leading-tight line-clamp-1">
                {booking.bookingSnapshot?.movieTitle || booking.movie?.title}
              </h3>
              <span className={`badge text-[9px] font-bold uppercase flex-shrink-0 ${isActive ? 'badge-success' : isCancelled ? 'badge-danger' : 'badge-warning'}`}>
                {booking.status}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#6B7280] font-medium mb-1">
              <img src={locationIcon} style={{ width: '10px', height: '13px', flexShrink: 0 }} alt="location" />
              <span className="truncate leading-none">{booking.bookingSnapshot?.theaterName || booking.theater?.name}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#6B7280] font-medium mb-2.5">
              <Calendar size={10} className="text-[#5B51DE]" />
              <span>{formatDate(booking.bookingSnapshot?.showDate)}</span>
              <Clock size={10} className="text-[#5B51DE]" />
              <span>{booking.bookingSnapshot?.showTime}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="badge-brand font-semibold text-[9px]">{booking.bookingSnapshot?.format}</span>
              <span className="text-[#6B7280] font-semibold text-[10px]">{booking.bookingSnapshot?.language}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Perforation divider */}
      <div className="ticket-perforation mx-4 my-4.5 border-t border-dashed border-[#E5E7EB]" />

      {/* Bottom section — seats, QR, price */}
      <div className="px-4.5 pb-4.5 flex items-end justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Seat list */}
          <div className="mb-3">
            <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1">Seats</p>
            <div className="flex flex-wrap gap-1.5">
              {booking.seats?.map((seat) => (
                <span key={seat.seatId} className="badge-brand text-[9px] font-bold">{seat.seatId}</span>
              ))}
            </div>
          </div>

          {/* Booking code */}
          <div className="mb-3">
            <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-0.5">Booking ID</p>
            <p className="text-xs font-mono font-bold text-[#1A1A1A]">{booking.bookingCode}</p>
          </div>

          {/* Total */}
          <div>
            <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-0.5">Total Paid</p>
            <p className="text-base font-display font-bold text-[#5B51DE]">{formatCurrency(booking.totalAmount)}</p>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="qr-container bg-[#EEF0FF] p-2 rounded-xl border border-[#C7C3F7]/50 shadow-sm flex items-center justify-center">
            <QRCode value={qrData} size={76} level="M" fgColor="#1A1A1A" bgColor="#EEF0FF" />
          </div>
          <p className="text-[9px] font-bold text-[#6B7280]">Scan at Entry</p>
        </div>
      </div>

      {/* Cancel button */}
      {isActive && onCancel && (
        <div className="px-4.5 pb-4.5">
          <button
            onClick={() => onCancel(booking._id)}
            className="w-full py-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-xs font-bold transition-all duration-150 active:scale-95"
          >
            Cancel Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default TicketCard;
