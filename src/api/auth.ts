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
    return response.data;
  } catch (error) {
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