import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectSelectedSeats, selectSeatCount } from '../../store/slices/seatSlice';
import { selectGrandTotal, selectTicketPrice } from '../../store/slices/bookingSlice';
import { formatCurrency } from '../../utils/helpers';
import { ShoppingBag } from 'lucide-react';

const PricePanel = () => {
  const navigate = useNavigate();
  const seatCount = useSelector(selectSeatCount);
  const grandTotal = useSelector(selectGrandTotal);
  const ticketPrice = useSelector(selectTicketPrice);

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-[#E5E7EB] px-5 py-3.5 flex items-center justify-between shadow-sm">
      <div>
        <p className="text-xs text-[#6B7280] font-medium mb-0.5">
          {seatCount > 0 ? `${seatCount} seat${seatCount > 1 ? 's' : ''} selected` : 'No seats selected'}
        </p>
        {seatCount > 0 ? (
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-display font-bold text-[#5B51DE]">
              {formatCurrency(grandTotal)}
            </span>
            <span className="text-[10px] text-[#6B7280] font-medium">incl. fees</span>
          </div>
        ) : (
          <span className="text-sm font-bold text-[#1A1A1A]">{formatCurrency(ticketPrice)} / seat</span>
        )}
      </div>

      {seatCount > 0 && (
        <button
          onClick={() => navigate('/booking-summary')}
          className="btn-brand flex items-center gap-2 py-2.5 px-4 text-xs font-bold shadow-md shadow-[#5B51DE]/25"
        >
          <ShoppingBag size={14} />
          Book Now
        </button>
      )}
    </div>
  );
};

export default PricePanel;
