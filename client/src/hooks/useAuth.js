import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  selectIsAuthenticated,
  selectUser,
  selectToken,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} from '../store/slices/authSlice';
import { login as loginService, register as registerService } from '../services/authService';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);

  const login = async (credentials) => {
    dispatch(loginStart());
    try {
      const res = await loginService(credentials);
      const { user, token } = res.data.data;
      dispatch(loginSuccess({ user, token }));
      toast.success(`Welcome back, ${user.name}! 🎬`);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      dispatch(loginFailure(message));
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (data) => {
    dispatch(loginStart());
    try {
      const res = await registerService(data);
      const { user, token } = res.data.data;
      dispatch(loginSuccess({ user, token }));
      toast.success(`Account created! Welcome, ${user.name}! 🎉`);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed.';
      dispatch(loginFailure(message));
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const signOut = () => {
    dispatch(logout());
    navigate('/');
    toast.success('Logged out successfully.');
  };

  return { isAuthenticated, user, token, login, register, signOut };
};
