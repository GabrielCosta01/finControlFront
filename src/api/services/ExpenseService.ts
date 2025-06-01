import axiosClient from '../axiosClient';
import { ROUTES } from '../apiRoutes';
import type { ExpenseCreateDto, ExpenseUpdateDto, ExpenseDetailResponseDto } from '../../types';

class ExpenseService {
  async getAll(): Promise<ExpenseDetailResponseDto[]> {
    const response = await axiosClient.get(ROUTES.EXPENSES.BASE);
    return response.data;
  }

  async getById(id: string): Promise<ExpenseDetailResponseDto> {
    const response = await axiosClient.get(ROUTES.EXPENSES.DETAIL(id));
    return response.data;
  }

  async create(data: ExpenseCreateDto): Promise<ExpenseDetailResponseDto> {
    const response = await axiosClient.post(ROUTES.EXPENSES.BASE, data);
    return response.data;
  }

  async update(id: string, data: ExpenseUpdateDto): Promise<ExpenseDetailResponseDto> {
    const response = await axiosClient.put(ROUTES.EXPENSES.DETAIL(id), data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axiosClient.delete(ROUTES.EXPENSES.DETAIL(id));
  }

  async updateAll(data: ExpenseUpdateDto): Promise<ExpenseDetailResponseDto[]> {
    const response = await axiosClient.put(ROUTES.EXPENSES.UPDATE_ALL, data);
    return response.data;
  }

  async deleteAll(): Promise<void> {
    await axiosClient.delete(ROUTES.EXPENSES.UPDATE_ALL);
  }
}

export default new ExpenseService(); 