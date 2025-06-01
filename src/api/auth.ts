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
  } catch (error) {
    throw error;
  }
}; 