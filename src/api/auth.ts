import axiosClient from './axiosClient';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await axiosClient.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 