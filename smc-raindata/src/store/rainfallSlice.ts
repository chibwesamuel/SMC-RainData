import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RainfallState {
  data: number[];
  loading: boolean;
  error: string | null;
}

const initialState: RainfallState = {
  data: [],
  loading: false,
  error: null,
};

const rainfallSlice = createSlice({
  name: 'rainfall',
  initialState,
  reducers: {
    fetchRainfallStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchRainfallSuccess(state, action: PayloadAction<number[]>) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchRainfallFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchRainfallStart, fetchRainfallSuccess, fetchRainfallFailure } = rainfallSlice.actions;

export default rainfallSlice.reducer;