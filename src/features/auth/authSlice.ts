import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;
}

// Carregar o token do localStorage ao inicializar
const getInitialToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

const initialState: AuthState = {
  token: getInitialToken(),
  isAuthenticated: !!getInitialToken(),
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      // Salvar no localStorage quando o token é atualizado
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', action.payload);
      }
    },
    clearToken: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      // Remover do localStorage quando o token é limpo
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setToken, clearToken, setError } = authSlice.actions;
export default authSlice.reducer; 