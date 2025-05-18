import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Payable {
  id: string;
  description: string;
  amount_total: number;
  due_date: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  total_installments: number;
  payment_method?: string;
  category_id?: string;
  bank_id?: string;
}

interface PayableState {
  payables: Payable[];
  loading: boolean;
  error: string | null;
}

const initialState: PayableState = {
  payables: [],
  loading: false,
  error: null,
};

const payableSlice = createSlice({
  name: 'payables',
  initialState,
  reducers: {
    setPayables: (state, action: PayloadAction<Payable[]>) => {
      state.payables = action.payload;
    },
    addPayable: (state, action: PayloadAction<Payable>) => {
      state.payables.push(action.payload);
    },
    updatePayable: (state, action: PayloadAction<Payable>) => {
      const index = state.payables.findIndex(payable => payable.id === action.payload.id);
      if (index !== -1) {
        state.payables[index] = action.payload;
      }
    },
    removePayable: (state, action: PayloadAction<string>) => {
      state.payables = state.payables.filter(payable => payable.id !== action.payload);
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
  setPayables,
  addPayable,
  updatePayable,
  removePayable,
  setLoading,
  setError,
} = payableSlice.actions;

export default payableSlice.reducer; 