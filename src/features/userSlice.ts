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
  // Se o erro já for uma string formatada, retorna ela
  if (error instanceof Error) {
    return error.message;
  }

  // Erro de rede
  if (error?.code === 'ERR_NETWORK') {
    return 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
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
  if (error instanceof Error) {
    return error;
  }

  return {
    message: error?.message || error?.response?.data?.message || 'Erro desconhecido',
    code: error?.code || 'UNKNOWN_ERROR',
    status: error?.response?.status,
    data: error?.response?.data
  };
};

// Thunk para registrar um novo usuário
export const registerUser = createAsyncThunk(
  'users/register',
  async (userData: { name: string; email: string; password: string; confirmPassword: string; salary: number }, { rejectWithValue }) => {
    try {
      const response = await register(userData);
      return response;
    } catch (error: any) {
      console.error('Erro ao registrar usuário:', error);
      // Garantir que apenas a mensagem de erro seja retornada
      return rejectWithValue(formatError(error));
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
        // O payload já é uma string formatada
        state.error = action.payload as string;
      });
  },
});

export const { clearUserError, setCurrentUser } = userSlice.actions;
export default userSlice.reducer; 