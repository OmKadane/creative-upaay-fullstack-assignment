import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import BottomNav from './components/layout/BottomNav';
import AuthGuard from './components/auth/AuthGuard';

// Pages
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import SchedulePage from './pages/SchedulePage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import BookingSummaryPage from './pages/BookingSummaryPage';
import CheckoutPage from './pages/CheckoutPage';
import BookingHistoryPage from './pages/BookingHistoryPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';

const App = () => {
  return (
    <div className="min-h-screen bg-dark-900 flex items-start justify-center">
      {/* Mobile shell — max 390px centered */}
      <div className="app-shell relative">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<HomePage />} />
          <Route path="/movies/:id" element={<MovieDetailPage />} />
          <Route path="/schedule/:movieId" element={<SchedulePage />} />
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
            path="/bookings"
            element={
              <AuthGuard>
                <BookingHistoryPage />
              </AuthGuard>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>

        <BottomNav />
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1a1a24',
            color: '#fff',
            border: '1px solid #2e2e45',
            borderRadius: '12px',
            fontSize: '13px',
            maxWidth: '360px',
          },
          success: {
            iconTheme: { primary: '#7c4dff', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
    </div>
  );
};

export default App;
