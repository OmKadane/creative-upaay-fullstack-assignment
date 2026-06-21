import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, AlertTriangle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import { reserveSeats } from '../services/bookingService';
import { selectGrandTotal } from '../store/slices/bookingSlice';
import { selectSelectedSeats, selectShowtimeId, resetSeatState } from '../store/slices/seatSlice';
import { setConfirmedBooking, resetBookingSelection } from '../store/slices/bookingSlice';
import { formatCurrency, formatCardNumber, luhnCheck } from '../utils/helpers';

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const grandTotal = useSelector(selectGrandTotal);
  const selectedSeats = useSelector(selectSelectedSeats);
  const showtimeId = useSelector(selectShowtimeId);

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [upiId, setUpiId] = useState('');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading
  const [simulateFailure, setSimulateFailure] = useState(false);

  const validateCard = () => {
    const newErrors = {};
    const rawNum = cardData.number.replace(/\s/g, '');

    if (!rawNum || rawNum.length < 16) newErrors.number = 'Enter a valid 16-digit card number';
    else if (!luhnCheck(rawNum)) newErrors.number = 'Invalid card number';
    if (!cardData.name.trim()) newErrors.name = 'Cardholder name is required';
    if (!cardData.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) newErrors.expiry = 'Enter valid expiry (MM/YY)';
    if (!cardData.cvv.match(/^\d{3,4}$/)) newErrors.cvv = 'Enter valid CVV';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (paymentMethod === 'card' && !validateCard()) return;
    if (paymentMethod === 'upi' && !upiId.includes('@')) {
      setErrors({ upi: 'Enter a valid UPI ID (e.g. user@upi)' });
      return;
    }

    if (!showtimeId || selectedSeats.length === 0) {
      toast.error('No seats selected.');
      navigate('/');
      return;
    }

    setStatus('loading');

    try {
      const res = await reserveSeats({
        showtimeId,
        seatIds: selectedSeats,
        paymentMethod,
        simulateFailure,
      });

      dispatch(setConfirmedBooking(res.data.data));
      dispatch(resetSeatState());
      dispatch(resetBookingSelection());
      setStatus('idle');
      navigate(`/payment-success/${res.data.data._id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Payment failed. Please try again.';
      toast.error(msg);
      setStatus('idle');
    }
  };

  return (
    <div className="page-container bg-[#F7F8FD]">
      <Header title="Payment" />

      {/* Amount banner */}
      <div className="mx-5 my-4 p-4.5 rounded-2xl bg-[#EEF0FF] border border-[#C7C3F7] shadow-sm">
        <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Total Amount</p>
        <p className="font-display font-bold text-3xl text-[#5B51DE]">{formatCurrency(grandTotal)}</p>
        <p className="text-[10px] font-semibold text-[#6B7280] mt-1.5">
          For {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''}: {selectedSeats.join(', ')}
        </p>
      </div>

      {/* Payment method selector */}
      <div className="mx-5 mb-4">
        <h2 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-3">Payment Method</h2>
        <div className="space-y-2.5">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.id}
              onClick={() => setPaymentMethod(method.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all duration-150 shadow-sm ${
                paymentMethod === method.id
                  ? 'border-[#5B51DE] bg-[#EEF0FF]'
                  : 'border-[#E5E7EB] bg-white hover:border-[#5B51DE]'
              }`}
            >
              <span className="text-lg">{method.icon}</span>
              <span className={`text-xs font-bold ${paymentMethod === method.id ? 'text-[#5B51DE]' : 'text-[#1A1A1A]'}`}>
                {method.label}
              </span>
              {paymentMethod === method.id && (
                <div className="ml-auto w-4.5 h-4.5 rounded-full bg-[#5B51DE] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Card form */}
      {paymentMethod === 'card' && (
        <div className="mx-5 mb-4 card bg-white border border-[#E5E7EB] p-4.5 space-y-3.5 animate-fade-in shadow-sm">
          {/* Card number */}
          <div>
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5 block">Card Number</label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                maxLength={19}
                placeholder="1234 5678 9012 3456"
                value={cardData.number}
                onChange={(e) => {
                  const formatted = formatCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16));
                  setCardData((p) => ({ ...p, number: formatted }));
                }}
                className={`input-field pr-10 font-mono tracking-widest ${errors.number ? 'border-red-500 ring-2 ring-red-500/10' : ''}`}
              />
              <CreditCard size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            </div>
            {errors.number && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.number}</p>}
          </div>

          {/* Name */}
          <div>
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5 block">Cardholder Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={cardData.name}
              onChange={(e) => setCardData((p) => ({ ...p, name: e.target.value }))}
              className={`input-field ${errors.name ? 'border-red-500 ring-2 ring-red-500/10' : ''}`}
            />
            {errors.name && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.name}</p>}
          </div>

          {/* Expiry + CVV */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5 block">Expiry</label>
              <input
                type="text"
                placeholder="MM/YY"
                maxLength={5}
                value={cardData.expiry}
                onChange={(e) => {
                  let v = e.target.value.replace(/\D/g, '');
                  if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
                  setCardData((p) => ({ ...p, expiry: v }));
                }}
                className={`input-field ${errors.expiry ? 'border-red-500 ring-2 ring-red-500/10' : ''}`}
              />
              {errors.expiry && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.expiry}</p>}
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5 block">CVV</label>
              <input
                type="password"
                placeholder="•••"
                maxLength={4}
                value={cardData.cvv}
                onChange={(e) => setCardData((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, '') }))}
                className={`input-field ${errors.cvv ? 'border-red-500 ring-2 ring-red-500/10' : ''}`}
              />
              {errors.cvv && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.cvv}</p>}
            </div>
          </div>
        </div>
      )}

      {/* UPI form */}
      {paymentMethod === 'upi' && (
        <div className="mx-5 mb-4 card bg-white border border-[#E5E7EB] p-4.5 animate-fade-in shadow-sm">
          <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5 block">UPI ID</label>
          <input
            type="text"
            placeholder="yourname@upi"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className={`input-field ${errors.upi ? 'border-red-500 ring-2 ring-red-500/10' : ''}`}
          />
          {errors.upi && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.upi}</p>}
        </div>
      )}

      {/* Net banking */}
      {paymentMethod === 'netbanking' && (
        <div className="mx-5 mb-4 card bg-white border border-[#E5E7EB] p-6 animate-fade-in text-center py-8 shadow-sm">
          <p className="text-2xl mb-2.5">🏦</p>
          <p className="text-xs font-bold text-[#1A1A1A]">Bank Portal Redirection</p>
          <p className="text-[11px] text-[#6B7280] mt-1">You will be redirected to complete payment.</p>
        </div>
      )}

      {/* Simulate failure toggle (dev/demo) */}
      <div className="mx-5 mb-4 flex items-center gap-3.5 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl shadow-sm">
        <AlertTriangle size={15} className="text-amber-600 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider">Simulate Payment Failure</p>
          <p className="text-[9px] text-[#6B7280] font-semibold mt-0.5">Toggle to test the payment failure screen</p>
        </div>
        <button
          onClick={() => setSimulateFailure((v) => !v)}
          className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${simulateFailure ? 'bg-red-500' : 'bg-gray-300'}`}
        >
          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${simulateFailure ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>
      </div>

      {/* Security note */}
      <div className="mx-5 mb-4 flex items-center gap-1.5 text-[10px] font-bold text-[#6B7280]">
        <Lock size={12} className="text-emerald-500" />
        <span>256-bit SSL encrypted payment processing</span>
      </div>

      {/* Pay button */}
      <div className="sticky bottom-0 px-5 pb-6 pt-3 bg-white border-t border-[#E5E7EB] shadow-[0_-4px_16px_rgba(0,0,0,0.03)] mt-6">
        <button
          onClick={handleSubmit}
          disabled={status === 'loading'}
          className="btn-brand w-full flex items-center justify-center gap-2 shadow-lg shadow-[#5B51DE]/25"
        >
          {status === 'loading' ? (
            <>
              <Loader size={18} className="animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <Lock size={16} />
              Pay {formatCurrency(grandTotal)} Securely
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
