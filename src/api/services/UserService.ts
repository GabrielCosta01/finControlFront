import axiosClient from '../axiosClient';
import { ROUTES } from '../apiRoutes';
import type { LoginDto, UserRegisterDto, UserDto } from '../../types';

class UserService {
  async login(credentials: LoginDto): Promise<{ token: string }> {
    const response = await axiosClient.post(ROUTES.AUTH.LOGIN, credentials);
    return response.data;
  }

  async register(data: UserRegisterDto): Promise<UserDto> {
    const response = await axiosClient.post(ROUTES.AUTH.REGISTER, data);
    return response.data;
  }

  async getAll(): Promise<UserDto[]> {
    const response = await axiosClient.get(ROUTES.USERS.BASE);
    return response.data;
  }

  async getById(id: string): Promise<UserDto> {
    const response = await axiosClient.get(ROUTES.USERS.DETAIL(id));
    return response.data;
  }

  async update(id: string, data: Partial<UserDto>): Promise<UserDto> {
    const response = await axiosClient.put(ROUTES.USERS.DETAIL(id), data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axiosClient.delete(ROUTES.USERS.DETAIL(id));
  }
}

export default new UserService(); 