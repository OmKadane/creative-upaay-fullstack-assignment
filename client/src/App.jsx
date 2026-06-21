import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import BottomNav from './components/layout/BottomNav';
import AuthGuard from './components/auth/AuthGuard';

// Pages
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import SelectTheatrePage from './pages/SelectTheatrePage';
import SelectSchedulePage from './pages/SelectSchedulePage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import BookingSummaryPage from './pages/BookingSummaryPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import TicketDetailPage from './pages/TicketDetailPage';
import BookingHistoryPage from './pages/BookingHistoryPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const App = () => {
  const location = useLocation();
  const hideBottomNav = ['/login', '/register'].includes(location.pathname);

  const toasterConfig = (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: '#ffffff',
          color: '#1a1a1a',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          fontSize: '13px',
          fontWeight: '600',
          maxWidth: '340px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        },
        success: {
          iconTheme: { primary: '#5b51de', secondary: '#fff' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#fff' },
        },
      }}
    />
  );

  return (
    <div className="min-h-screen bg-[#E5E8F3] flex items-start justify-center py-6">
      {/* Mobile shell — max 390px centered */}
      <div className="app-shell relative shadow-2xl border border-gray-200/50 rounded-[5px]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/movies/:id" element={<MovieDetailPage />} />
          <Route path="/select-theatre/:movieId" element={<SelectTheatrePage />} />
          <Route path="/select-schedule/:movieId/:theaterId" element={<SelectSchedulePage />} />
          
          <Route
            path="/seat-selection/:showtimeId"
            element={
              <AuthGuard>
                <SeatSelectionPage />
              </AuthGuard>
            }
          />
          <Route
            path="/booking-summary"
            element={
              <AuthGuard>
                <BookingSummaryPage />
              </AuthGuard>
            }
          />
          <Route
            path="/checkout"
            element={
              <AuthGuard>
                <CheckoutPage />
              </AuthGuard>
            }
          />
          <Route
            path="/payment-success/:reservationId"
            element={
              <AuthGuard>
                <PaymentSuccessPage />
              </AuthGuard>
            }
          />
          <Route
            path="/ticket/:id"
            element={
              <AuthGuard>
                <TicketDetailPage />
              </AuthGuard>
            }
          />
          <Route
            path="/tickets"
            element={
              <AuthGuard>
                <BookingHistoryPage />
              </AuthGuard>
            }
          />
          <Route
            path="/favorites"
            element={
              <AuthGuard>
                <FavoritesPage />
              </AuthGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthGuard>
                <ProfilePage />
              </AuthGuard>
            }
          />
        </Routes>

        {!hideBottomNav && <BottomNav />}
      </div>

      {toasterConfig}
    </div>
  );
};

export default App;
