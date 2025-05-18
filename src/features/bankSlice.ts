import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Bank {
  id: string;
  name: string;
  balance: number;
}

interface BankState {
  banks: Bank[];
  loading: boolean;
  error: string | null;
}

const initialState: BankState = {
  banks: [],
  loading: false,
  error: null,
};

const bankSlice = createSlice({
  name: 'banks',
  initialState,
  reducers: {
    setBanks: (state, action: PayloadAction<Bank[]>) => {
      state.banks = action.payload;
    },
    addBank: (state, action: PayloadAction<Bank>) => {
      state.banks.push(action.payload);
    },
    updateBank: (state, action: PayloadAction<Bank>) => {
      const index = state.banks.findIndex(bank => bank.id === action.payload.id);
      if (index !== -1) {
        state.banks[index] = action.payload;
      }
    },
    removeBank: (state, action: PayloadAction<string>) => {
      state.banks = state.banks.filter(bank => bank.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setBanks, addBank, updateBank, removeBank, setLoading, setError } = bankSlice.actions;

export default bankSlice.reducer; 