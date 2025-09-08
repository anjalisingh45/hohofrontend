import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import eventReducer from './slices/eventSlice';
import registrationReducer from './slices/registrationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    registrations: registrationReducer,
  },
});
