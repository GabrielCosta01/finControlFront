import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Receivable {
  id: string;
  description: string;
  amount_total: number;
  due_date: string;
  status: 'PENDING' | 'RECEIVED' | 'LATE';
  total_installments: number;
  payment_method?: string;
  category_id?: string;
  bank_id?: string;
}

interface ReceivableState {
  receivables: Receivable[];
  loading: boolean;
  error: string | null;
}

const initialState: ReceivableState = {
  receivables: [],
  loading: false,
  error: null,
};

const receivableSlice = createSlice({
  name: 'receivables',
  initialState,
  reducers: {
    setReceivables: (state, action: PayloadAction<Receivable[]>) => {
      state.receivables = action.payload;
    },
    addReceivable: (state, action: PayloadAction<Receivable>) => {
      state.receivables.push(action.payload);
    },
    updateReceivable: (state, action: PayloadAction<Receivable>) => {
      const index = state.receivables.findIndex(receivable => receivable.id === action.payload.id);
      if (index !== -1) {
        state.receivables[index] = action.payload;
      }
    },
    removeReceivable: (state, action: PayloadAction<string>) => {
      state.receivables = state.receivables.filter(receivable => receivable.id !== action.payload);
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
  setReceivables,
  addReceivable,
  updateReceivable,
  removeReceivable,
  setLoading,
  setError,
} = receivableSlice.actions;

export default receivableSlice.reducer; 