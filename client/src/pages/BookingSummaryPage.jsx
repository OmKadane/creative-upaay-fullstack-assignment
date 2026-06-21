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
  <div className={`flex items-center justify-between py-2.5 ${sub ? 'pl-3' : ''}`}>
    <span className={`text-xs ${highlight ? 'font-bold text-[#1A1A1A]' : sub ? 'font-medium text-[#6B7280]' : 'font-semibold text-[#1A1A1A]'}`}>
      {label}
    </span>
    <span className={`font-semibold ${highlight ? 'text-[#5B51DE] text-base font-display font-bold' : sub ? 'text-[#6B7280]' : 'text-[#1A1A1A]'}`}>
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
      <div className="page-container bg-[#F7F8FD] flex flex-col items-center justify-center gap-4">
        <p className="text-4xl">🎭</p>
        <p className="text-[#6B7280] text-sm">No booking in progress.</p>
        <button className="btn-brand" onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="page-container bg-[#F7F8FD]">
      <Header title="Booking Summary" />

      {/* Movie info card */}
      <div className="mx-5 my-4 card bg-white border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="flex gap-4.5 p-4.5">
          {selectedMovie?.posterUrl && (
            <img
              src={selectedMovie.posterUrl}
              alt={selectedMovie.title}
              className="w-16 h-24 object-cover rounded-xl border border-[#E5E7EB] shadow-sm flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-sm text-[#1A1A1A] leading-tight mb-1">
              {selectedMovie?.title}
            </h2>
            <p className="text-[11px] text-[#6B7280] font-medium mb-2.5">{selectedShowtime.theater?.name}</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px] font-semibold">
              <div>
                <span className="text-[#9CA3AF] uppercase">Date</span>
                <p className="text-[#1A1A1A] font-bold">{formatDate(selectedShowtime.date)}</p>
              </div>
              <div>
                <span className="text-[#9CA3AF] uppercase">Time</span>
                <p className="text-[#1A1A1A] font-bold">{selectedShowtime.time}</p>
              </div>
              <div>
                <span className="text-[#9CA3AF] uppercase">Format</span>
                <p className="text-[#5B51DE] font-bold">{selectedShowtime.format}</p>
              </div>
              <div>
                <span className="text-[#9CA3AF] uppercase">Screen</span>
                <p className="text-[#1A1A1A] font-bold">Screen {selectedShowtime.screen}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected seats */}
      <div className="mx-5 mb-4 card bg-white border border-[#E5E7EB] p-4.5 shadow-sm">
        <div className="flex items-center gap-2 mb-3.5">
          <Ticket size={14} className="text-[#5B51DE]" />
          <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Selected Seats</h3>
          <span className="badge-brand ml-auto font-bold">{seatCount} ticket{seatCount > 1 ? 's' : ''}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {seatObjects.map((seat) => (
            <div key={seat.seatId} className="flex flex-col items-center bg-[#EEF0FF] border border-[#C7C3F7] rounded-xl px-3 py-1.5 min-w-[50px] shadow-sm">
              <span className="text-[#5B51DE] font-bold text-sm leading-none mb-0.5">{seat.seatId}</span>
              <span className="text-[8px] font-bold text-[#6B7280]">Row {seat.row}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Price breakdown */}
      <div className="mx-5 mb-4 card bg-white border border-[#E5E7EB] p-4.5 shadow-sm">
        <div className="flex items-center gap-2 mb-3.5">
          <Tag size={14} className="text-[#5B51DE]" />
          <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Price Breakdown</h3>
        </div>

        <div className="divide-y divide-[#E5E7EB]">
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
        <div className="flex items-start gap-2 mt-4 p-3 bg-[#EEF0FF]/40 rounded-xl border border-[#C7C3F7]/50 shadow-sm">
          <Info size={13} className="text-[#5B51DE] flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-[#6B7280] font-semibold leading-relaxed">
            Booking fee is non-refundable. Tickets are non-transferable. Please carry a valid ID for verification at the theater.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="sticky bottom-20 px-5 pb-5 mt-4">
        <button
          onClick={() => navigate('/checkout')}
          className="btn-brand w-full flex items-center justify-center gap-2 shadow-lg shadow-[#5B51DE]/25"
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
