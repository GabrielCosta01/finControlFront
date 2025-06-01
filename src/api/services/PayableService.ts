import BillService from './BillService';
import type { BillCreateDto, BillUpdateDto, BillResponseDto, BillStatus } from '../../types';

class PayableService {
  async getAll(params?: {
    status?: BillStatus;
    expenseCategoryId?: string;
    bankId?: string;
  }): Promise<BillResponseDto[]> {
    return BillService.getAll(params);
  }

  async getById(id: string): Promise<BillResponseDto> {
    return BillService.getById(id);
  }

  async create(data: BillCreateDto): Promise<BillResponseDto> {
    return BillService.create(data);
  }

  async update(id: string, data: BillUpdateDto): Promise<BillResponseDto> {
    return BillService.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return BillService.delete(id);
  }

  async markAsPaid(id: string): Promise<BillResponseDto> {
    return BillService.markAsPaid(id);
  }
}

export default new PayableService(); 