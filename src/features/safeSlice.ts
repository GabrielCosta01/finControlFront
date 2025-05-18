import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Safe {
  id: string;
  name: string;
  balance: number;
  currency: string;
  bank_id?: string;
}

interface SafeState {
  safes: Safe[];
  loading: boolean;
  error: string | null;
}

const initialState: SafeState = {
  safes: [],
  loading: false,
  error: null,
};

const safeSlice = createSlice({
  name: 'safes',
  initialState,
  reducers: {
    setSafes: (state, action: PayloadAction<Safe[]>) => {
      state.safes = action.payload;
    },
    addSafe: (state, action: PayloadAction<Safe>) => {
      state.safes.push(action.payload);
    },
    updateSafe: (state, action: PayloadAction<Safe>) => {
      const index = state.safes.findIndex(safe => safe.id === action.payload.id);
      if (index !== -1) {
        state.safes[index] = action.payload;
      }
    },
    removeSafe: (state, action: PayloadAction<string>) => {
      state.safes = state.safes.filter(safe => safe.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSafes,
  addSafe,
  updateSafe,
  removeSafe,
  setLoading,
  setError,
} = safeSlice.actions;

export default safeSlice.reducer; 