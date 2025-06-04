import axiosClient from './axiosClient';
import { ROUTES } from './apiRoutes';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  salary: number;
}

interface LoginResponse {
  token: string;
}

interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  salary: number;
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  salary?: number;
}

export const logout = async (): Promise<void> => {
  try {
    // Opcional: enviar requisição para logout no servidor, se existir essa rota
    // await axiosClient.post(ROUTES.AUTH.LOGOUT);
    
    // Remover token do localStorage
    localStorage.removeItem('authToken');
  } catch (error) {
    console.error('Error during logout:', error);
    // Mesmo com erro, remover token local para garantir o logout
    localStorage.removeItem('authToken');
  }
};

export const getCurrentUser = async (): Promise<UserProfile> => {
  try {
    const response = await axiosClient.get(ROUTES.AUTH.ME);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await axiosClient.post(ROUTES.AUTH.LOGIN, credentials);
    console.log('Login response:', response); // Log para debug
    
    // Verifica se o token está na resposta diretamente ou dentro de data
    const token = response.data?.token || response.data;
    
    // Se o token for uma string completa (incluindo "Bearer"), mantém como está
    const finalToken = typeof token === 'string' && token.startsWith('Bearer ') 
      ? token 
      : `Bearer ${token}`;

    if (!finalToken) {
      throw new Error('Token não encontrado na resposta');
    }

    return { token: finalToken };
  } catch (error) {
    console.error('Login error details:', error); // Log detalhado do erro
    throw error;
  }
};

export const register = async (data: RegisterData): Promise<RegisterResponse> => {
  try {
    const response = await axiosClient.post(ROUTES.AUTH.REGISTER, data);
    return response.data;
  } catch (error: any) {
    // Tratamento específico para erros da API
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    // Tratamento para erros de validação com array de mensagens
    if (error.response?.status === 400 && Array.isArray(error.response.data)) {
      throw new Error(error.response.data.join('\n'));
    }

    // Tratamento para erros de validação
    if (error.response?.status === 400) {
      throw new Error('Dados inválidos. Verifique as informações e tente novamente.');
    }

    // Tratamento para erro de email já existente
    if (error.response?.status === 409) {
      throw new Error('Este email já está em uso. Por favor, use outro email.');
    }

    // Erro genérico
    throw new Error('Não foi possível realizar o cadastro. Tente novamente mais tarde.');
  }
}; 