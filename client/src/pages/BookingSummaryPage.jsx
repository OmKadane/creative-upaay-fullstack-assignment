import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Tag, Ticket, CreditCard, ChevronRight, Info } from 'lucide-react';
import Header from '../components/layout/Header';
import {
  selectBookingState,
  selectGrandTotal,
  selectCurrentTotalPrice,
  selectBookingFee,
  selectTicketPrice,
} from '../store/slices/bookingSlice';
import { selectSelectedSeatObjects, selectSeatCount } from '../store/slices/seatSlice';
import { formatCurrency, formatDate } from '../utils/helpers';

const RowItem = ({ label, value, highlight = false, sub = false }) => (
  <div className={`flex items-center justify-between py-2 ${sub ? 'pl-3' : ''}`}>
    <span className={`text-sm ${highlight ? 'font-semibold text-white' : sub ? 'text-xs text-gray-500' : 'text-gray-300'}`}>
      {label}
    </span>
    <span className={`font-medium ${highlight ? 'text-brand-400 text-base font-display font-bold' : sub ? 'text-xs text-gray-400' : 'text-sm text-white'}`}>
      {value}
    </span>
  </div>
);

const BookingSummaryPage = () => {
  const navigate = useNavigate();
  const booking = useSelector(selectBookingState);
  const seatObjects = useSelector(selectSelectedSeatObjects);
  const seatCount = useSelector(selectSeatCount);
  const totalPrice = useSelector(selectCurrentTotalPrice);
  const bookingFee = useSelector(selectBookingFee);
  const grandTotal = useSelector(selectGrandTotal);
  const ticketPrice = useSelector(selectTicketPrice);

  const { selectedShowtime, selectedMovie } = booking;

  if (!selectedShowtime || seatCount === 0) {
    return (
      <div className="page-container flex flex-col items-center justify-center gap-4">
        <p className="text-4xl">🎭</p>
        <p className="text-gray-400 text-sm">No booking in progress.</p>
        <button className="btn-brand" onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header title="Booking Summary" />

      {/* Movie info card */}
      <div className="mx-5 my-4 card overflow-hidden">
        <div className="flex gap-3 p-4">
          {selectedMovie?.posterUrl && (
            <img
              src={selectedMovie.posterUrl}
              alt={selectedMovie.title}
              className="w-16 h-24 object-cover rounded-xl flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-base text-white leading-tight mb-1">
              {selectedMovie?.title}
            </h2>
            <p className="text-xs text-gray-400 mb-2">{selectedShowtime.theater?.name}</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
              <div>
                <span className="text-gray-500">Date</span>
                <p className="text-white font-medium">{formatDate(selectedShowtime.date)}</p>
              </div>
              <div>
                <span className="text-gray-500">Time</span>
                <p className="text-white font-medium">{selectedShowtime.time}</p>
              </div>
              <div>
                <span className="text-gray-500">Format</span>
                <p className="text-brand-400 font-medium">{selectedShowtime.format}</p>
              </div>
              <div>
                <span className="text-gray-500">Screen</span>
                <p className="text-white font-medium">Screen {selectedShowtime.screen}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected seats */}
      <div className="mx-5 mb-4 card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Ticket size={14} className="text-brand-400" />
          <h3 className="text-sm font-semibold text-white">Selected Seats</h3>
          <span className="badge-brand ml-auto">{seatCount} ticket{seatCount > 1 ? 's' : ''}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {seatObjects.map((seat) => (
            <div key={seat.seatId} className="flex flex-col items-center bg-brand-500/10 border border-brand-500/30 rounded-xl px-3 py-1.5">
              <span className="text-brand-400 font-bold text-sm">{seat.seatId}</span>
              <span className="text-[9px] text-gray-500">Row {seat.row}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Price breakdown */}
      <div className="mx-5 mb-4 card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Tag size={14} className="text-brand-400" />
          <h3 className="text-sm font-semibold text-white">Price Breakdown</h3>
        </div>

        <div className="divide-y divide-dark-600/40">
          <RowItem
            label={`Ticket × ${seatCount}`}
            value={`${formatCurrency(ticketPrice)} × ${seatCount}`}
          />
          <RowItem label="Subtotal" value={formatCurrency(totalPrice)} sub />
          <RowItem label="Booking Fee (5%)" value={formatCurrency(bookingFee)} sub />
          <div className="pt-2 mt-1">
            <RowItem
              label="Total Amount"
              value={formatCurrency(grandTotal)}
              highlight
            />
          </div>
        </div>

        {/* Info note */}
        <div className="flex items-start gap-2 mt-3 p-3 bg-brand-500/5 rounded-xl border border-brand-500/20">
          <Info size={13} className="text-brand-400 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-gray-400 leading-relaxed">
            Booking fee is non-refundable. Tickets are non-transferable. Please carry a valid ID for verification.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="sticky bottom-20 px-5 pb-5">
        <button
          onClick={() => navigate('/checkout')}
          className="btn-brand w-full flex items-center justify-center gap-2"
        >
          <CreditCard size={18} />
          Proceed to Payment · {formatCurrency(grandTotal)}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default BookingSummaryPage;
