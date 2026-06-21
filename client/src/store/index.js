import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storageModule from 'redux-persist/lib/storage';
const storage = storageModule.default || storageModule;
import { combineReducers } from 'redux';

import authReducer from './slices/authSlice';
import movieReducer from './slices/movieSlice';
import bookingReducer from './slices/bookingSlice';
import seatReducer from './slices/seatSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  movies: movieReducer,
  booking: bookingReducer,
  seat: seatReducer,
});

// Only persist booking and seat state (mid-flight persistence)
const persistConfig = {
  key: 'cinebook',
  storage,
  whitelist: ['booking', 'seat', 'auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store);
