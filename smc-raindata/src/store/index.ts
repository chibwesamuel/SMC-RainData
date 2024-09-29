import { configureStore } from '@reduxjs/toolkit';
import rainfallReducer from './rainfallSlice';

export const store = configureStore({
  reducer: {
    rainfall: rainfallReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;