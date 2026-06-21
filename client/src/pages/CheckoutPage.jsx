import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle, XCircle, AlertTriangle, Loader } from 'lucide-react';
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
  const [status, setStatus] = useState('idle'); // idle | loading | success | failure
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
      setStatus('success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Payment failed. Please try again.';
      toast.error(msg);
      setStatus('failure');
    }
  };

  // ── Success Screen ──
  if (status === 'success') {
    return (
      <div className="h-screen flex flex-col items-center justify-center px-8 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-5 animate-bounce-soft">
          <CheckCircle size={36} className="text-emerald-400" />
        </div>
        <h1 className="font-display font-bold text-2xl text-white mb-2 text-center">Booking Confirmed!</h1>
        <p className="text-gray-400 text-sm text-center mb-1">
          Your tickets are ready. Enjoy the show! 🎬
        </p>
        <p className="text-gray-500 text-xs text-center mb-8">
          Confirmation sent to your email.
        </p>
        <div className="flex flex-col gap-3 w-full">
          <button className="btn-brand w-full" onClick={() => navigate('/bookings')}>
            View My Tickets
          </button>
          <button className="btn-ghost w-full" onClick={() => navigate('/')}>
            Browse More Movies
          </button>
        </div>
      </div>
    );
  }

  // ── Failure Screen ──
  if (status === 'failure') {
    return (
      <div className="h-screen flex flex-col items-center justify-center px-8 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mb-5">
          <XCircle size={36} className="text-red-400" />
        </div>
        <h1 className="font-display font-bold text-2xl text-white mb-2 text-center">Payment Failed</h1>
        <p className="text-gray-400 text-sm text-center mb-8">
          Your seats have been released. Please try again.
        </p>
        <div className="flex flex-col gap-3 w-full">
          <button className="btn-brand w-full" onClick={() => setStatus('idle')}>
            Try Again
          </button>
          <button className="btn-ghost w-full" onClick={() => navigate('/')}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header title="Payment" />

      {/* Amount banner */}
      <div className="mx-5 my-4 p-4 rounded-2xl bg-gradient-to-br from-brand-900/40 to-brand-500/10 border border-brand-500/20">
        <p className="text-xs text-gray-400 mb-1">Total Amount</p>
        <p className="font-display font-bold text-3xl text-brand-400">{formatCurrency(grandTotal)}</p>
        <p className="text-xs text-gray-500 mt-1">For {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''}: {selectedSeats.join(', ')}</p>
      </div>

      {/* Payment method selector */}
      <div className="mx-5 mb-4">
        <h2 className="text-sm font-semibold text-white mb-3">Payment Method</h2>
        <div className="space-y-2">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.id}
              onClick={() => setPaymentMethod(method.id)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-150 ${
                paymentMethod === method.id
                  ? 'border-brand-500 bg-brand-500/10'
                  : 'border-dark-400 bg-dark-700 hover:border-dark-300'
              }`}
            >
              <span className="text-lg">{method.icon}</span>
              <span className={`text-sm font-medium ${paymentMethod === method.id ? 'text-brand-400' : 'text-gray-300'}`}>
                {method.label}
              </span>
              {paymentMethod === method.id && (
                <div className="ml-auto w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Card form */}
      {paymentMethod === 'card' && (
        <div className="mx-5 mb-4 card p-4 space-y-3 animate-fade-in">
          {/* Card number */}
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Card Number</label>
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
                className={`input-field pr-10 font-mono tracking-widest ${errors.number ? 'border-red-500' : ''}`}
              />
              <CreditCard size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
            {errors.number && <p className="text-[10px] text-red-400 mt-1">{errors.number}</p>}
          </div>

          {/* Name */}
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Cardholder Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={cardData.name}
              onChange={(e) => setCardData((p) => ({ ...p, name: e.target.value }))}
              className={`input-field ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-[10px] text-red-400 mt-1">{errors.name}</p>}
          </div>

          {/* Expiry + CVV */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Expiry</label>
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
                className={`input-field ${errors.expiry ? 'border-red-500' : ''}`}
              />
              {errors.expiry && <p className="text-[10px] text-red-400 mt-1">{errors.expiry}</p>}
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">CVV</label>
              <input
                type="password"
                placeholder="•••"
                maxLength={4}
                value={cardData.cvv}
                onChange={(e) => setCardData((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, '') }))}
                className={`input-field ${errors.cvv ? 'border-red-500' : ''}`}
              />
              {errors.cvv && <p className="text-[10px] text-red-400 mt-1">{errors.cvv}</p>}
            </div>
          </div>
        </div>
      )}

      {/* UPI form */}
      {paymentMethod === 'upi' && (
        <div className="mx-5 mb-4 card p-4 animate-fade-in">
          <label className="text-xs text-gray-400 mb-1.5 block">UPI ID</label>
          <input
            type="text"
            placeholder="yourname@upi"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className={`input-field ${errors.upi ? 'border-red-500' : ''}`}
          />
          {errors.upi && <p className="text-[10px] text-red-400 mt-1">{errors.upi}</p>}
        </div>
      )}

      {/* Net banking placeholder */}
      {paymentMethod === 'netbanking' && (
        <div className="mx-5 mb-4 card p-4 animate-fade-in text-center py-8">
          <p className="text-2xl mb-2">🏦</p>
          <p className="text-sm text-gray-400">You'll be redirected to your bank's portal.</p>
        </div>
      )}

      {/* Simulate failure toggle (dev/demo) */}
      <div className="mx-5 mb-4 flex items-center gap-2 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
        <AlertTriangle size={14} className="text-amber-400 flex-shrink-0" />
        <p className="text-[10px] text-amber-400 flex-1">Demo: Simulate payment failure</p>
        <button
          onClick={() => setSimulateFailure((v) => !v)}
          className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${simulateFailure ? 'bg-red-500' : 'bg-dark-500'}`}
        >
          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${simulateFailure ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>
      </div>

      {/* Security note */}
      <div className="mx-5 mb-4 flex items-center gap-2 text-xs text-gray-500">
        <Lock size={12} className="text-emerald-500" />
        <span>256-bit SSL encrypted payment</span>
      </div>

      {/* Pay button */}
      <div className="sticky bottom-0 px-5 pb-6 pt-3 glass border-t border-dark-600/30">
        <button
          onClick={handleSubmit}
          disabled={status === 'loading'}
          className="btn-brand w-full flex items-center justify-center gap-2"
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
