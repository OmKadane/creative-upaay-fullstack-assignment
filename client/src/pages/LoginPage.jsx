import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import sofaLogo from '../assets/sofa.svg';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/';
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.email.match(/^\S+@\S+\.\S+$/)) errs.email = 'Enter a valid email';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const result = await login({ email: form.email, password: form.password });
    setLoading(false);
    if (result.success) navigate(from, { replace: true });
  };

  return (
    <div className="h-full bg-[#F7F8FD] relative overflow-hidden">
      {/* Sofa Logo absolute positioned per Figma specs */}
      <img 
        src={sofaLogo} 
        alt="Twin Sofa Logo" 
        className="absolute"
        style={{ 
          width: '104px', 
          height: '64px', 
          top: '74px', 
          left: '142px', 
          opacity: 1,
          transform: 'rotate(0deg)'
        }}
      />

      {/* Text Header absolute positioned per Figma specs */}
      <div 
        className="absolute text-center flex flex-col justify-center"
        style={{
          width: '182px',
          height: '48px',
          top: '158px',
          left: '103px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
          fontSize: '20px',
          lineHeight: '100%',
          color: '#000000',
        }}
      >
        Creative Upaay Hiring Assignment
      </div>

      {/* ── Segmented Control absolute positioned per Figma specs ── */}
      <div 
        className="absolute flex bg-[#EBEBEB] p-0.5 rounded-[5px]"
        style={{
          width: '342px',
          height: '35px',
          top: '264px',
          left: '24px',
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="flex-1 py-1 text-xs font-bold rounded-[5px] transition-all duration-200 bg-white text-[#1A1A1A] shadow-sm"
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => navigate('/signup')}
          className="flex-1 py-1 text-xs font-bold rounded-[5px] transition-all duration-200 text-[#6B7280] hover:text-[#1A1A1A]"
        >
          Sign Up
        </button>
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit}>
        {/* ── Fields Container absolute positioned per Figma specs ── */}
        <div 
          className="absolute flex flex-col"
          style={{
            width: '342px',
            height: '110px',
            top: '347px',
            left: '24px',
            gap: '28px',
          }}
        >
          {/* Email ID */}
          <div className="flex flex-col relative" style={{ height: '41px' }}>
            <input
              type="email"
              placeholder="Email ID"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className={`w-full bg-transparent border-b border-[#C7C7C7] p-[10px] text-sm text-[#1A1A1A] placeholder-[#9CA3AF] outline-none transition-all duration-150 rounded-none focus:border-[#5B51DE] h-[41px] ${
                errors.email ? 'border-red-400' : ''
              }`}
            />
            {errors.email && (
              <p className="text-[10px] text-red-500 font-bold absolute bottom-[-16px] left-[10px]">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col relative" style={{ height: '41px' }}>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              className={`w-full bg-transparent border-b border-[#C7C7C7] p-[10px] text-sm text-[#1A1A1A] placeholder-[#9CA3AF] outline-none transition-all duration-150 rounded-none focus:border-[#5B51DE] h-[41px] ${
                errors.password ? 'border-red-400' : ''
              }`}
            />
            {errors.password && (
              <p className="text-[10px] text-red-500 font-bold absolute bottom-[-16px] left-[10px]">{errors.password}</p>
            )}
          </div>
        </div>

        {/* Submit Button absolute positioned per Figma specs */}
        <button
          type="submit"
          disabled={loading}
          className="absolute rounded-[5px] text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] active:scale-[0.98] transition-all duration-150 shadow-md shadow-[#4F46E5]/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{
            width: '345px',
            height: '37px',
            top: '650px',
            left: '21px',
            paddingTop: '10px',
            paddingRight: '39px',
            paddingBottom: '10px',
            paddingLeft: '39px',
          }}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Logging In…
            </>
          ) : (
            'Login'
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
