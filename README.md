# 🎬 CineBook — Movie Ticket Reservation App

> A mobile-first, full-stack Movie Ticket Reservation web application built with React, Redux, Node.js/Express, and MongoDB. Designed for the Creative Upaay Full-Stack Engineering Hiring Assignment.

---

## ✨ Features

- **Now Showing & Coming Soon** — Scrollable home screen with movie cards and real-time availability
- **Movie Details** — Hero banner, synopsis, cast list, and available formats (2D/3D)
- **Theatre & Showtime Selector** — Horizontal date picker + theatre/format/time slots
- **Interactive Seat Matrix** — 13×12 (A–M × 1–12) grid with Available / Selected / Occupied states; max 6 seats per booking
- **Dynamic Pricing Panel** — Real-time running total at top of seat selection view
- **Booking Summary** — Ticket breakdown with booking fee calculation
- **Simulated Checkout** — Mock payment form with credit card validation + success/failure flows
- **User Authentication** — JWT-secured routes; demo credentials pre-filled on login
- **Booking History** — "My Bookings" page with QR-code ticket cards and cancellation
- **Concurrency Control** — Distributed lock mechanism preventing double-booking race conditions
- **ACID Transactions** — MongoDB session-wrapped seat allocation with automatic rollback on failure
- **Mid-flight Persistence** — Redux state synced to `localStorage`; full refresh recovery

---

## 🏗️ Architecture Overview

```
creative-upaay-fullstack-assignment/
├── client/                        # React + Vite + Tailwind CSS frontend
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   │   ├── layout/            # AppShell, BottomNav, Header
│   │   │   ├── movie/             # MovieCard, MovieBanner, CastCard
│   │   │   ├── seat/              # SeatMatrix, SeatLegend, ScreenIndicator
│   │   │   ├── booking/           # BookingSummary, TicketCard, QRCode
│   │   │   └── auth/              # LoginForm, AuthGuard
│   │   ├── pages/                 # Route-level page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── MovieDetailPage.jsx
│   │   │   ├── SchedulePage.jsx
│   │   │   ├── SeatSelectionPage.jsx
│   │   │   ├── BookingSummaryPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── BookingHistoryPage.jsx
│   │   │   └── LoginPage.jsx
│   │   ├── store/                 # Redux Toolkit configuration
│   │   │   ├── index.js           # Store setup + localStorage middleware
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       ├── movieSlice.js
│   │   │       ├── bookingSlice.js
│   │   │       └── seatSlice.js
│   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   └── usePersistState.js
│   │   ├── services/              # Axios API service layer
│   │   │   ├── api.js
│   │   │   ├── movieService.js
│   │   │   ├── bookingService.js
│   │   │   └── authService.js
│   │   ├── utils/                 # Helpers (price calc, date format, etc.)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── server/                        # Node.js + Express backend
    ├── controllers/
    │   ├── authController.js
    │   ├── movieController.js
    │   ├── theaterController.js
    │   └── bookingController.js
    ├── middleware/
    │   ├── authMiddleware.js
    │   └── errorMiddleware.js
    ├── models/
    │   ├── User.js
    │   ├── Movie.js
    │   ├── Theater.js
    │   ├── Showtime.js
    │   └── Reservation.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── movieRoutes.js
    │   ├── theaterRoutes.js
    │   └── bookingRoutes.js
    ├── utils/
    │   └── lockManager.js
    ├── seed/
    │   └── seedData.js
    ├── config/
    │   └── db.js
    ├── server.js
    └── package.json
```

---

## 🚀 Local Setup & Installation

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- MongoDB (local instance or MongoDB Atlas connection string)

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/creative-upaay-fullstack-assignment.git
cd creative-upaay-fullstack-assignment
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/cinebook
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Seed the database with sample movies and theatres:

```bash
npm run seed
```

Start the backend server:

```bash
npm run dev
```

> Server runs at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../client
npm install
```

Create a `.env` file inside `client/`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite dev server:

```bash
npm run dev
```

> App runs at `http://localhost:5173`

---

## 🔐 Demo Credentials

The login page pre-fills these credentials for evaluator convenience:

| Field    | Value              |
|----------|--------------------|
| Email    | `demo@cinebook.app`|
| Password | `Demo@1234`        |

---

## 📡 API Reference

### Auth

| Method | Endpoint              | Description               | Auth Required |
|--------|-----------------------|---------------------------|---------------|
| POST   | `/api/auth/register`  | Register new user         | ❌            |
| POST   | `/api/auth/login`     | Login & receive JWT       | ❌            |
| GET    | `/api/auth/me`        | Get current user profile  | ✅            |

### Movies

| Method | Endpoint              | Description               | Auth Required |
|--------|-----------------------|---------------------------|---------------|
| GET    | `/api/movies`         | List all movies           | ❌            |
| GET    | `/api/movies/:id`     | Get movie details         | ❌            |

### Theaters & Showtimes

| Method | Endpoint                            | Description                        | Auth Required |
|--------|-------------------------------------|------------------------------------|---------------|
| GET    | `/api/theaters`                     | List all theatres                  | ❌            |
| GET    | `/api/theaters/:id/showtimes`       | Get showtimes for a theatre        | ❌            |
| GET    | `/api/showtimes/:id/seats`          | Get seat map for a showtime        | ❌            |

### Bookings

| Method | Endpoint                        | Description                              | Auth Required |
|--------|---------------------------------|------------------------------------------|---------------|
| POST   | `/api/bookings/reserve`         | Reserve seats (ACID transaction)         | ✅            |
| GET    | `/api/bookings/my-bookings`     | Get user's booking history               | ✅            |
| POST   | `/api/bookings/:id/cancel`      | Cancel a booking + release seats         | ✅            |

---

## ⚙️ Tech Stack

| Layer          | Technology                                      |
|----------------|-------------------------------------------------|
| Frontend       | React 18, Vite 5, React Router DOM 6            |
| Styling        | Tailwind CSS 3                                  |
| State          | Redux Toolkit, redux-persist                    |
| Backend        | Node.js 18+, Express 4                          |
| Database       | MongoDB 7, Mongoose 8                           |
| Auth           | JSON Web Tokens (JWT), bcryptjs                 |
| HTTP Client    | Axios                                           |
| Concurrency    | In-memory distributed lock (LockManager util)   |
| Transactions   | MongoDB ACID sessions                           |

---

## 🔒 Concurrency & ACID Guarantees

- **Distributed Locking**: `server/utils/lockManager.js` implements a TTL-based in-memory lock per `showtimeId`. When a user initiates checkout, a lock is acquired for the target seats and held for 30 seconds maximum. Concurrent requests for the same seats return `409 Conflict` until the lock expires.
- **MongoDB Transactions**: Seat reservation and `Reservation` document creation are wrapped in a `mongoose.startSession()` transaction. Any error causes an automatic rollback, returning seats to `Available`.

---

## 📱 Mobile-First Layout

The app enforces a `max-width: 390px` container centered in the viewport, matching the Figma specification. All layouts are designed exclusively for this mobile viewport with no responsive breakpoints.
