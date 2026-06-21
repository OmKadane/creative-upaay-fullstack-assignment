import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectSelectedSeats, selectSeatCount } from '../../store/slices/seatSlice';
import { selectGrandTotal, selectCurrentTotalPrice, selectTicketPrice } from '../../store/slices/bookingSlice';
import { formatCurrency } from '../../utils/helpers';
import { ShoppingBag } from 'lucide-react';

const PricePanel = () => {
  const navigate = useNavigate();
  const selectedSeats = useSelector(selectSelectedSeats);
  const seatCount = useSelector(selectSeatCount);
  const currentTotal = useSelector(selectCurrentTotalPrice);
  const grandTotal = useSelector(selectGrandTotal);
  const ticketPrice = useSelector(selectTicketPrice);

  return (
    <div className="sticky top-0 z-30 glass border-b border-dark-600/30 px-5 py-3 flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-400 mb-0.5">
          {seatCount > 0 ? `${seatCount} seat${seatCount > 1 ? 's' : ''} selected` : 'No seats selected'}
        </p>
        {seatCount > 0 && (
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-display font-bold text-brand-400">
              {formatCurrency(grandTotal)}
            </span>
            <span className="text-[10px] text-gray-500">incl. fees</span>
          </div>
        )}
        {seatCount === 0 && (
          <span className="text-sm text-gray-500">{formatCurrency(ticketPrice)} / seat</span>
        )}
      </div>

      {seatCount > 0 && (
        <button
          onClick={() => navigate('/booking-summary')}
          className="btn-brand flex items-center gap-2 py-2.5 px-4 text-sm"
        >
          <ShoppingBag size={15} />
          Book Now
        </button>
      )}
    </div>
  );
};

export default PricePanel;
