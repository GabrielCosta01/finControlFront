import axiosClient from '../axiosClient';
import { ROUTES } from '../apiRoutes';
import type { BankCreateDto, BankUpdateDto, BankDto, BankTransferDto, BankMetricsDto } from '../../types';

class BankService {
  async getAll(): Promise<BankDto[]> {
    const response = await axiosClient.get(ROUTES.BANKS.BASE);
    return response.data;
  }

  async getById(id: string): Promise<BankDto> {
    const response = await axiosClient.get(ROUTES.BANKS.DETAIL(id));
    return response.data;
  }

  async create(data: BankCreateDto): Promise<BankDto> {
    const response = await axiosClient.post(ROUTES.BANKS.BASE, data);
    return response.data;
  }

  async update(id: string, data: BankUpdateDto): Promise<BankDto> {
    const response = await axiosClient.put(ROUTES.BANKS.DETAIL(id), data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axiosClient.delete(ROUTES.BANKS.DETAIL(id));
  }

  async clearIncomes(id: string): Promise<void> {
    await axiosClient.delete(ROUTES.BANKS.CLEAR_INCOMES(id));
  }

  async clearExpenses(id: string): Promise<void> {
    await axiosClient.delete(ROUTES.BANKS.CLEAR_EXPENSES(id));
  }

  // Novos métodos
  async updateAll(data: BankUpdateDto[]): Promise<BankDto[]> {
    const response = await axiosClient.put(ROUTES.BANKS.UPDATE_ALL, data);
    return response.data;
  }

  async addMoney(bankId: string, amount: number): Promise<BankDto> {
    const response = await axiosClient.post(ROUTES.BANKS.ADD_MONEY(bankId), { amount });
    return response.data;
  }

  async removeMoney(bankId: string, amount: number): Promise<BankDto> {
    const response = await axiosClient.post(ROUTES.BANKS.REMOVE_MONEY(bankId), { amount });
    return response.data;
  }

  async transfer(data: BankTransferDto): Promise<void> {
    await axiosClient.post(ROUTES.BANKS.TRANSFER, data);
  }

  async addMoneyToAll(amount: number): Promise<void> {
    await axiosClient.post(ROUTES.BANKS.ADD_MONEY_ALL, { amount });
  }

  async removeMoneyFromAll(amount: number): Promise<void> {
    await axiosClient.post(ROUTES.BANKS.REMOVE_MONEY_ALL, { amount });
  }

  async getMetrics(): Promise<BankMetricsDto> {
    const response = await axiosClient.get(ROUTES.BANKS.METRICS);
    return response.data;
  }

  async deleteAll(): Promise<void> {
    await axiosClient.delete(ROUTES.BANKS.DELETE_ALL);
  }
}

export default new BankService(); 