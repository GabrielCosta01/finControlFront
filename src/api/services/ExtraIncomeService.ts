import axiosClient from '../axiosClient';
import { ROUTES } from '../apiRoutes';
import type { ExtraIncomeDto, ExtraIncomeCreateDto, ExtraIncomeUpdateDto, ExtraIncomeTransferDto } from '../../types';

class ExtraIncomeService {
  async getAll(): Promise<ExtraIncomeDto[]> {
    const response = await axiosClient.get(ROUTES.EXTRA_INCOME.BASE);
    return response.data;
  }

  async getById(id: string): Promise<ExtraIncomeDto> {
    const response = await axiosClient.get(ROUTES.EXTRA_INCOME.DETAIL(id));
    return response.data;
  }

  async create(data: ExtraIncomeCreateDto): Promise<ExtraIncomeDto> {
    const response = await axiosClient.post(ROUTES.EXTRA_INCOME.BASE, data);
    return response.data;
  }

  async update(id: string, data: ExtraIncomeUpdateDto): Promise<ExtraIncomeDto> {
    const response = await axiosClient.put(ROUTES.EXTRA_INCOME.DETAIL(id), data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axiosClient.delete(ROUTES.EXTRA_INCOME.DETAIL(id));
  }

  async updateAll(data: ExtraIncomeUpdateDto[]): Promise<ExtraIncomeDto[]> {
    const response = await axiosClient.put(ROUTES.EXTRA_INCOME.UPDATE_ALL, data);
    return response.data;
  }

  async deleteAll(): Promise<void> {
    await axiosClient.delete(ROUTES.EXTRA_INCOME.DELETE_ALL);
  }

  async transfer(data: ExtraIncomeTransferDto): Promise<void> {
    await axiosClient.post(ROUTES.EXTRA_INCOME.TRANSFER, data);
  }

  async subtract(id: string, amount: number): Promise<ExtraIncomeDto> {
    const response = await axiosClient.patch(ROUTES.EXTRA_INCOME.SUBTRACT(id), { amount });
    return response.data;
  }

  async add(id: string, amount: number): Promise<ExtraIncomeDto> {
    const response = await axiosClient.patch(ROUTES.EXTRA_INCOME.ADD(id), { amount });
    return response.data;
  }

  async subtractAll(amount: number): Promise<void> {
    await axiosClient.patch(ROUTES.EXTRA_INCOME.SUBTRACT_ALL, { amount });
  }

  async addAll(amount: number): Promise<void> {
    await axiosClient.patch(ROUTES.EXTRA_INCOME.ADD_ALL, { amount });
  }

  async getByCategory(categoryId: string): Promise<ExtraIncomeDto[]> {
    const response = await axiosClient.get(ROUTES.EXTRA_INCOME.BY_CATEGORY(categoryId));
    return response.data;
  }

  async deleteByCategory(categoryId: string): Promise<void> {
    await axiosClient.delete(ROUTES.EXTRA_INCOME.DELETE_BY_CATEGORY(categoryId));
  }

  async getByBank(bankId: string): Promise<ExtraIncomeDto[]> {
    const response = await axiosClient.get(ROUTES.EXTRA_INCOME.BY_BANK(bankId));
    return response.data;
  }

  async deleteByBank(bankId: string): Promise<void> {
    await axiosClient.delete(ROUTES.EXTRA_INCOME.DELETE_BY_BANK(bankId));
  }
}

export default new ExtraIncomeService(); 