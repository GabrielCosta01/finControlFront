import { configureStore } from '@reduxjs/toolkit';
import {
  bankReducer,
  categoryReducer,
  safeReducer,
  payableReducer,
  receivableReducer,
  transactionReducer,
  userReducer
} from '../features';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    banks: bankReducer,
    categories: categoryReducer,
    safes: safeReducer,
    payables: payableReducer,
    receivables: receivableReducer,
    transactions: transactionReducer,
    auth: authReducer,
    users: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
