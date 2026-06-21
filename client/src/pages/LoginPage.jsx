import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Info } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const from = location.state?.from?.pathname || '/';
  const [isRegister, setIsRegister] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: 'demo@cinebook.app',
    password: 'Demo@1234',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (isRegister && !form.name.trim()) errs.name = 'Name is required';
    if (!form.email.match(/^\S+@\S+\.\S+$/)) errs.email = 'Enter a valid email';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const result = isRegister
      ? await register(form)
      : await login({ email: form.email, password: form.password });
    setLoading(false);
    if (result.success) navigate(from, { replace: true });
  };

  return (
    /* Light off-white canvas, still constrained to the 390px mobile shell */
    <div className="min-h-screen bg-[#F7F8FD] flex flex-col px-6 py-10">

      {/* ── Page heading ── */}
      <div className="mb-8">
        <h1
          className="font-display font-bold text-[22px] leading-snug text-[#1A1A1A]"
          style={{ letterSpacing: '-0.3px' }}
        >
          Creative Upaay{'\n'}
          <span className="text-[#5B51DE]">Hiring Assignment</span>
        </h1>
        <p className="text-[13px] text-[#6B7280] mt-1">
          {isRegister ? 'Create your account to get started.' : 'Sign in to continue booking.'}
        </p>
      </div>

      {/* ── Tab toggle ── */}
      <div className="flex bg-white border border-[#E5E7EB] rounded-2xl p-1 mb-6 shadow-sm">
        <button
          type="button"
          onClick={() => { setIsRegister(false); setErrors({}); }}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
            !isRegister
              ? 'bg-[#5B51DE] text-white shadow'
              : 'text-[#6B7280] hover:text-[#1A1A1A]'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => { setIsRegister(true); setErrors({}); }}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
            isRegister
              ? 'bg-[#5B51DE] text-white shadow'
              : 'text-[#6B7280] hover:text-[#1A1A1A]'
          }`}
        >
          Register
        </button>
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Demo credentials notice (sign-in only) */}
        {!isRegister && (
          <div className="flex items-start gap-2.5 p-3.5 bg-[#EEF0FF] border border-[#C7C3F7] rounded-xl">
            <Info size={14} className="text-[#5B51DE] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-semibold text-[#5B51DE] mb-0.5">
                Demo Credentials Pre-filled
              </p>
              <p className="text-[11px] text-[#6B7280]">Email: demo@cinebook.app</p>
              <p className="text-[11px] text-[#6B7280]">Password: Demo@1234</p>
            </div>
          </div>
        )}

        {/* Name (register only) */}
        {isRegister && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#374151]">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-[#1A1A1A]
                placeholder-[#9CA3AF] outline-none transition-all duration-150
                focus:border-[#5B51DE] focus:ring-2 focus:ring-[#5B51DE]/15
                ${errors.name ? 'border-red-400' : 'border-[#E5E7EB]'}`}
            />
            {errors.name && (
              <p className="text-[11px] text-red-500">{errors.name}</p>
            )}
          </div>
        )}

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-[#374151]">Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-[#1A1A1A]
              placeholder-[#9CA3AF] outline-none transition-all duration-150
              focus:border-[#5B51DE] focus:ring-2 focus:ring-[#5B51DE]/15
              ${errors.email ? 'border-red-400' : 'border-[#E5E7EB]'}`}
          />
          {errors.email && (
            <p className="text-[11px] text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-[#374151]">Password</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              className={`w-full bg-white border rounded-xl px-4 py-3 pr-11 text-sm text-[#1A1A1A]
                placeholder-[#9CA3AF] outline-none transition-all duration-150
                focus:border-[#5B51DE] focus:ring-2 focus:ring-[#5B51DE]/15
                ${errors.password ? 'border-red-400' : 'border-[#E5E7EB]'}`}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#5B51DE] transition-colors"
              aria-label="Toggle password visibility"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-red-500">{errors.password}</p>
          )}
        </div>

        {/* Forgot password (sign-in only) */}
        {!isRegister && (
          <div className="flex justify-end -mt-1">
            <button
              type="button"
              className="text-[12px] text-[#5B51DE] font-medium hover:underline"
            >
              Forgot password?
            </button>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-1 py-3.5 rounded-xl text-sm font-semibold text-white
            bg-[#5B51DE] hover:bg-[#4843C8] active:scale-[0.98]
            transition-all duration-150 shadow-md shadow-[#5B51DE]/25
            disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              {isRegister ? 'Creating Account…' : 'Signing In…'}
            </>
          ) : (
            isRegister ? 'Create Account' : 'Sign In'
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="mt-auto pt-10 text-center text-[11px] text-[#9CA3AF]">
        By continuing, you agree to our{' '}
        <span className="text-[#5B51DE] cursor-pointer">Terms</span> &amp;{' '}
        <span className="text-[#5B51DE] cursor-pointer">Privacy Policy</span>
      </p>
    </div>
  );
};

export default LoginPage;
