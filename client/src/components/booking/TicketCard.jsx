import { QRCodeSVG as QRCode } from 'qrcode.react';
import { MapPin, Calendar, Clock } from 'lucide-react';
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
    <div className={`card animate-slide-up mx-4 mb-4 overflow-hidden ${isCancelled ? 'opacity-60' : ''}`}>
      {/* Top section — movie info */}
      <div className="p-4 pb-0">
        <div className="flex gap-3">
          {booking.movie?.posterUrl && (
            <img
              src={booking.movie.posterUrl}
              alt={booking.movie?.title}
              className="w-14 h-20 object-cover rounded-xl flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-display font-bold text-sm text-white leading-tight line-clamp-2">
                {booking.bookingSnapshot?.movieTitle || booking.movie?.title}
              </h3>
              <span className={`badge text-[9px] flex-shrink-0 ${isActive ? 'badge-success' : isCancelled ? 'badge-danger' : 'badge-warning'}`}>
                {booking.status}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
              <MapPin size={10} className="flex-shrink-0" />
              <span className="truncate">{booking.bookingSnapshot?.theaterName || booking.theater?.name}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <Calendar size={10} />
              <span>{formatDate(booking.bookingSnapshot?.showDate)}</span>
              <Clock size={10} />
              <span>{booking.bookingSnapshot?.showTime}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="badge-brand">{booking.bookingSnapshot?.format}</span>
              <span className="text-gray-500">{booking.bookingSnapshot?.language}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Perforation divider */}
      <div className="ticket-perforation mx-4 my-4 border-t border-dashed border-dark-500" />

      {/* Bottom section — seats, QR, price */}
      <div className="px-4 pb-4 flex items-end justify-between gap-4">
        <div className="flex-1">
          {/* Seat list */}
          <div className="mb-3">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Seats</p>
            <div className="flex flex-wrap gap-1">
              {booking.seats?.map((seat) => (
                <span key={seat.seatId} className="badge-brand text-[10px]">{seat.seatId}</span>
              ))}
            </div>
          </div>

          {/* Booking code */}
          <div className="mb-3">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Booking ID</p>
            <p className="text-xs font-mono text-white">{booking.bookingCode}</p>
          </div>

          {/* Total */}
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Total Paid</p>
            <p className="text-base font-display font-bold text-brand-400">{formatCurrency(booking.totalAmount)}</p>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center gap-1">
          <div className="qr-container">
            <QRCode value={qrData} size={72} level="M" />
          </div>
          <p className="text-[9px] text-gray-500">Scan at entry</p>
        </div>
      </div>

      {/* Cancel button */}
      {isActive && onCancel && (
        <div className="px-4 pb-4">
          <button
            onClick={() => onCancel(booking._id)}
            className="w-full py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors duration-150 active:scale-95"
          >
            Cancel Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default TicketCard;
