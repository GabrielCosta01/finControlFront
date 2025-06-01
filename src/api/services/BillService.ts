import axiosClient from '../axiosClient';
import { ROUTES } from '../apiRoutes';
import type { BillCreateDto, BillUpdateDto, BillResponseDto, BillStatus } from '../../types';

class BillService {
  async getAll(params?: {
    status?: BillStatus;
    expenseCategoryId?: string;
    bankId?: string;
  }): Promise<BillResponseDto[]> {
    const response = await axiosClient.get(ROUTES.BILLS.BASE, { params });
    return response.data;
  }

  async getById(id: string): Promise<BillResponseDto> {
    const response = await axiosClient.get(ROUTES.BILLS.DETAIL(id));
    return response.data;
  }

  async create(data: BillCreateDto): Promise<BillResponseDto> {
    const response = await axiosClient.post(ROUTES.BILLS.BASE, data);
    return response.data;
  }

  async update(id: string, data: BillUpdateDto): Promise<BillResponseDto> {
    const response = await axiosClient.patch(ROUTES.BILLS.DETAIL(id), data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axiosClient.delete(ROUTES.BILLS.DETAIL(id));
  }

  async markAsPaid(id: string): Promise<BillResponseDto> {
    const response = await axiosClient.patch(ROUTES.BILLS.MARK_AS_PAID(id));
    return response.data;
  }
}

export default new BillService(); 