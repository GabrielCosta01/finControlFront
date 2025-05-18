import { configureStore } from '@reduxjs/toolkit';
import {
  bankReducer,
  categoryReducer,
  safeReducer,
  payableReducer,
  receivableReducer,
  transactionReducer,
} from '../features';

export const store = configureStore({
  reducer: {
    banks: bankReducer,
    categories: categoryReducer,
    safes: safeReducer,
    payables: payableReducer,
    receivables: receivableReducer,
    transactions: transactionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
