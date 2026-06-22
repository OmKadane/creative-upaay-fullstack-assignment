# 🎬 CineBook — Movie Ticket Reservation System

A full-stack mobile-first web application for browsing movies, selecting theaters, choosing showtimes, picking seats, and completing ticket bookings — all in one seamless flow.

> **Live Demo:** [https://creativeupaay-assignment.onrender.com](https://creativeupaay-assignment.onrender.com)

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Features](#-features)
- [Booking Flow](#-booking-flow)
- [API Reference](#-api-reference)
- [Database Models](#-database-models)
- [State Management](#-state-management)
- [Environment Variables](#-environment-variables)
- [Local Development](#-local-development)
- [Database Seeding](#-database-seeding)
- [Deployment (Render)](#-deployment-render)

---

## 🛠️ Tech Stack

### Frontend (`/client`)
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 8 | Build tool & dev server |
| React Router DOM v6 | Client-side routing |
| Redux Toolkit + Redux Persist | Global state management |
| Axios | HTTP client |
| Tailwind CSS v3 | Utility-first styling |
| Lucide React | Icon library |
| QRCode.react | QR code generation for tickets |
| React Hot Toast | Toast notifications |

### Backend (`/server`)
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |
| Helmet | HTTP security headers |
| CORS | Cross-origin resource sharing |
| Morgan | HTTP request logging |
| express-rate-limit | API rate limiting (200 req/15 min) |
| express-async-errors | Async error handling |
| express-validator | Request validation |

---

## 📁 Project Structure

```
creative-upaay-fullstack-assignment/
├── package.json              # Root monorepo scripts (build, start, seed)
│
├── client/                   # React + Vite frontend
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env                  # VITE_API_URL
│   └── src/
│       ├── main.jsx          # App entry point (Redux + Router providers)
│       ├── App.jsx           # Route definitions + BottomNav logic
│       ├── App.css
│       ├── index.css         # Global styles & design tokens
│       │
│       ├── pages/            # One component per route
│       │   ├── HomePage.jsx
│       │   ├── MovieDetailPage.jsx
│       │   ├── SelectTheatrePage.jsx
│       │   ├── SelectSchedulePage.jsx
│       │   ├── SeatSelectionPage.jsx
│       │   ├── BookingSummaryPage.jsx
│       │   ├── CheckoutPage.jsx
│       │   ├── PaymentSuccessPage.jsx
│       │   ├── TicketDetailPage.jsx
│       │   ├── BookingHistoryPage.jsx
│       │   ├── FavoritesPage.jsx
│       │   ├── ProfilePage.jsx
│       │   ├── LoginPage.jsx
│       │   └── RegisterPage.jsx
│       │
│       ├── components/
│       │   ├── auth/
│       │   │   └── AuthGuard.jsx       # Redirect unauthenticated users
│       │   ├── booking/                # Booking-related sub-components
│       │   ├── layout/
│       │   │   └── BottomNav.jsx       # Mobile bottom navigation
│       │   ├── movie/                  # Movie card, carousel components
│       │   └── seat/                   # Seat grid, seat legend components
│       │
│       ├── services/                   # Axios API call wrappers
│       │   ├── api.js                  # Axios instance (baseURL, token interceptor)
│       │   ├── authService.js          # register, login, getMe
│       │   ├── movieService.js         # getMovies, getMovieById
│       │   └── bookingService.js       # getShowtimesForMovie, reserveSeats, etc.
│       │
│       ├── store/                      # Redux Toolkit store
│       │   ├── index.js                # configureStore + redux-persist
│       │   └── slices/
│       │       ├── authSlice.js        # user, token, isAuthenticated
│       │       ├── bookingSlice.js     # selectedMovie, theater, showtime, seats
│       │       ├── movieSlice.js       # movies list cache
│       │       └── seatSlice.js        # seat selection state
│       │
│       ├── hooks/                      # Custom React hooks
│       └── utils/                      # Shared utility functions
│
└── server/                   # Express + MongoDB backend
    ├── server.js             # Entry point — middleware, routes, static serving
    ├── .env                  # Environment variables
    │
    ├── config/
    │   └── db.js             # MongoDB connection (Mongoose)
    │
    ├── models/
    │   ├── User.js           # name, email, password (bcrypt), bookings ref
    │   ├── Movie.js          # title, genre, cast, formats, posterUrl, status
    │   ├── Theater.js        # name, location, screens, basePrice, maxPrice
    │   ├── Showtime.js       # movie ref, theater ref, date, time, format, seats[]
    │   └── Reservation.js    # user ref, showtime ref, seats, totalAmount, status
    │
    ├── controllers/
    │   ├── authController.js     # register, login, getMe
    │   ├── movieController.js    # getMovies, getMovieById
    │   ├── theaterController.js  # getTheaters, showtimes, seat maps
    │   └── bookingController.js  # reserveSeats, getMyBookings, cancelBooking
    │
    ├── routes/
    │   ├── authRoutes.js
    │   ├── movieRoutes.js
    │   ├── theaterRoutes.js
    │   └── bookingRoutes.js
    │
    ├── middleware/
    │   ├── authMiddleware.js     # JWT protect() guard
    │   └── errorMiddleware.js    # Global async error handler
    │
    ├── utils/                    # Server utilities
    └── seed/
        └── seedData.js           # Populates movies, theaters, showtimes, demo user
```

---

## ✨ Features

- **Browse Movies** — Now Showing & Coming Soon sections with posters
- **Movie Detail** — Cast, genre, duration, rating, formats, IMDB score
- **Select Theatre** — Filtered list of theaters with logos and price ranges
- **Select Schedule** — Date picker + available showtimes per format (2D / 3D / IMAX)
- **Seat Selection** — Interactive seat grid with real-time availability (available / occupied / locked)
- **Booking Summary** — Order review with seat & pricing breakdown
- **Checkout & Payment** — Simulated payment flow
- **E-Ticket** — QR code ticket generation with booking details
- **Booking History** — All past and upcoming reservations
- **Favorites** — Save favorite movies
- **User Profile** — View and manage account info
- **Authentication** — JWT-based register/login with session persistence via Redux Persist

---

## 🗺️ Booking Flow

```
HomePage → MovieDetailPage → SelectTheatrePage → SelectSchedulePage
    → SeatSelectionPage → BookingSummaryPage → CheckoutPage
        → PaymentSuccessPage → TicketDetailPage
```

Routes behind `AuthGuard` (login required):
- `/seat-selection/:showtimeId`
- `/booking-summary`
- `/checkout`
- `/payment-success/:reservationId`
- `/ticket/:id`
- `/tickets`
- `/favorites`
- `/profile`

---

## 📡 API Reference

Base URL: `/api`
Rate limit: **200 requests per 15 minutes**

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | ❌ | Create a new user account |
| `POST` | `/login` | ❌ | Login and receive JWT token |
| `GET` | `/me` | ✅ | Get current authenticated user |

### Movies — `/api/movies`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | ❌ | Get all movies |
| `GET` | `/:id` | ❌ | Get a single movie by ID |

### Theaters — `/api/theaters`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | ❌ | Get all active theaters |
| `GET` | `/:id` | ❌ | Get theater by ID |
| `GET` | `/:id/showtimes` | ❌ | Get showtimes for a theater (filter by `?movieId&date`) |
| `GET` | `/showtimes/movie/:movieId` | ❌ | Get all showtimes for a movie across theaters (filter by `?date&format`) |
| `GET` | `/showtimes/:showtimeId/seats` | ❌ | Get seat map for a specific showtime (auto-expires stale locks) |

### Bookings — `/api/bookings`
> All booking routes require a valid JWT Bearer token.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/reserve` | ✅ | Reserve seats for a showtime |
| `GET` | `/my-bookings` | ✅ | Get all bookings for the current user |
| `GET` | `/:id` | ✅ | Get a specific booking by ID |
| `POST` | `/:id/cancel` | ✅ | Cancel a booking |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server status check |

---

## 🗄️ Database Models

### User
```js
{ name, email, password (hashed), createdAt }
```

### Movie
```js
{ title, description, genre[], duration, rating, imdbRating, releaseDate,
  posterUrl, bannerUrl, cast[{ name, role, photo }], formats[], language,
  status ('now_showing' | 'coming_soon'), tags[] }
```

### Theater
```js
{ name, location: { address, city, state, pincode },
  screens, amenities[], basePrice, maxPrice, logo, isActive }
```

### Showtime
```js
{ movie (ref), theater (ref), date, time, format ('2D'|'3D'|'IMAX'|'4DX'),
  screen, language, priceMultiplier, totalSeats, availableSeats,
  seats[{ seatId, row, column, status, lockedBy, lockedAt, lockExpiry }] }
```
> Seat map (13 rows × 12 cols = 156 seats) is auto-generated on first save.

### Reservation
```js
{ user (ref), showtime (ref), seats[], totalAmount, status, paymentMethod }
```

---

## 🔐 State Management (Redux)

| Slice | State |
|-------|-------|
| `authSlice` | `user`, `token`, `isAuthenticated` |
| `movieSlice` | `movies[]` (list cache) |
| `bookingSlice` | `selectedMovie`, `selectedTheater`, `selectedShowtime`, `selectedSeats[]` |
| `seatSlice` | seat grid selection state |

Redux Persist saves `auth` and `booking` slices to `localStorage`, maintaining session across page refreshes.

---

## ⚙️ Environment Variables

### Server — `server/.env`
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/cinebook?retryWrites=true&w=majority
JWT_SECRET=<your-64-char-hex-secret>
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Client — `client/.env`
```env
VITE_API_URL=http://localhost:5000/api
```
> In production on Render, leave `VITE_API_URL` empty or unset — the client uses relative paths (`/api`) which resolve to the same Express server.

---

## 💻 Local Development

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the Repository
```bash
git clone https://github.com/OmKadane/creative-upaay-fullstack-assignment.git
cd creative-upaay-fullstack-assignment
```

### 2. Install Dependencies

Install everything at once from root:
```bash
npm run install-all
```

Or individually:
```bash
# Backend
npm install --prefix server

# Frontend
npm install --prefix client
```

### 3. Configure Environment
Create `server/.env` and `client/.env` with the values shown in the [Environment Variables](#-environment-variables) section.

### 4. Seed the Database
```bash
npm run seed --prefix server
```
This creates 6 movies, 4 theaters, 768 showtimes, and 1 demo user.

### 5. Start Dev Servers

Open two terminals:

```bash
# Terminal 1 — Backend (http://localhost:5000)
npm run dev --prefix server

# Terminal 2 — Frontend (http://localhost:5173)
npm run dev --prefix client
```

---

## 🌱 Database Seeding

Running the seed script will:
1. **Clear** all existing data (users, movies, theaters, showtimes)
2. Create **6 movies** (Dune: Part Two, Oppenheimer, Deadpool & Wolverine, Inside Out 2, Alien: Romulus, Gladiator II)
3. Create **4 theaters** (The Grandview, Play Loft, CinemaOne, Cinemount)
4. Generate **768 showtimes** with full seat maps across 8 days

> You can register a new account directly from the app — no pre-seeded credentials required.

```bash
# From root
npm run seed

# Or from server directory
npm run seed --prefix server
```

---

## 🚀 Deployment (Render)

The project is configured as a **single Render Web Service** — the Express server both serves the API and the compiled Vite React app in production.

### Build Command
```bash
npm run build
```
*(Installs all dependencies and runs `vite build` to produce `client/dist`)*

### Start Command
```bash
npm start
```
*(Runs `node server/server.js` which serves both API routes and the React SPA)*

### Required Environment Variables on Render
```
MONGO_URI       → Your MongoDB Atlas connection string
JWT_SECRET      → A secure 64-character hex string
JWT_EXPIRES_IN  → 7d
NODE_ENV        → production
PORT            → (set automatically by Render)
```

> MongoDB Atlas Network Access must allow **0.0.0.0/0** because Render uses dynamic IPs.
>
> After first deploy, run the seed script from Render's **Shell** tab: `npm run seed`

---

## 📄 License

MIT — see [LICENSE](./LICENSE)
