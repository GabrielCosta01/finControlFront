import axiosClient from '../axiosClient';
import { ROUTES } from '../apiRoutes';
import type { ReceivableCreateDto, ReceivableUpdateDto, ReceivableResponseDto, ReceivableStatus } from '../../types';

class ReceivableService {
  async getAll(params?: {
    status?: ReceivableStatus;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<{
    content: ReceivableResponseDto[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
  }> {
    const response = await axiosClient.get(ROUTES.RECEIVABLES.BASE, { params });
    return response.data;
  }

  async getById(id: string): Promise<ReceivableResponseDto> {
    const response = await axiosClient.get(ROUTES.RECEIVABLES.DETAIL(id));
    return response.data;
  }

  async create(data: ReceivableCreateDto): Promise<ReceivableResponseDto> {
    const response = await axiosClient.post(ROUTES.RECEIVABLES.BASE, data);
    return response.data;
  }

  async update(id: string, data: ReceivableUpdateDto): Promise<ReceivableResponseDto> {
    const response = await axiosClient.patch(ROUTES.RECEIVABLES.DETAIL(id), data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axiosClient.delete(ROUTES.RECEIVABLES.DETAIL(id));
  }

  async markAsReceived(id: string): Promise<ReceivableResponseDto> {
    const response = await axiosClient.put(ROUTES.RECEIVABLES.MARK_AS_RECEIVED(id));
    return response.data;
  }
}

export default new ReceivableService(); 