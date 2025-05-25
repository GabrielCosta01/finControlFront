import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../api/entities';
import { register } from '../api/auth';

interface UserState {
  users: any[];
  currentUser: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
};

// Função para formatar erros recebidos da API ou de rede
const formatError = (error: any): string => {
  // Erro de rede
  if (error?.code === 'ERR_NETWORK') {
    return 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet ou tente novamente mais tarde.';
  }
  
  // Erro da API com mensagem específica
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Erro com mensagem simples
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  // Mensagem genérica
  return 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
};

// Extrair informações serializáveis do erro
const serializeError = (error: any) => {
  return {
    message: error?.message || 'Erro desconhecido',
    code: error?.code || 'UNKNOWN_ERROR',
    status: error?.response?.status,
    data: error?.response?.data
  };
};

// Thunk para registrar um novo usuário
export const registerUser = createAsyncThunk(
  'users/register',
  async (userData: { name: string; email: string; password: string; salary: number }, { rejectWithValue }) => {
    try {
      // Usar a função de registro do arquivo auth.ts
      const response = await register(userData);
      return response;
    } catch (error: any) {
      console.error('Erro ao registrar usuário:', error);
      // Retornar apenas dados serializáveis do erro
      return rejectWithValue(serializeError(error));
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    setCurrentUser: (state, action: PayloadAction<any>) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        state.currentUser = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload 
          ? formatError(action.payload) 
          : 'Falha ao registrar usuário. Tente novamente mais tarde.';
      });
  },
});

export const { clearUserError, setCurrentUser } = userSlice.actions;
export default userSlice.reducer; 