import axiosClient from '../axiosClient';
import { ROUTES } from '../apiRoutes';
import type { VaultCreateDto, VaultUpdateDto, VaultDto } from '../../types';

class VaultService {
  async getAll(): Promise<VaultDto[]> {
    const response = await axiosClient.get(ROUTES.VAULTS.BASE);
    return response.data;
  }

  async getById(id: string): Promise<VaultDto> {
    const response = await axiosClient.get(ROUTES.VAULTS.DETAIL(id));
    console.log(response.data);
    return response.data;
  }

  async getByBank(bankId: string): Promise<VaultDto[]> {
    const response = await axiosClient.get(ROUTES.VAULTS.BY_BANK(bankId));
    return response.data;
  }

  async create(data: VaultCreateDto): Promise<VaultDto> {
    try {
      const response = await axiosClient.post(ROUTES.VAULTS.BASE, data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async update(id: string, data: VaultUpdateDto): Promise<VaultDto> {
    const response = await axiosClient.put(ROUTES.VAULTS.DETAIL(id), data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axiosClient.delete(ROUTES.VAULTS.DETAIL(id));
  }
}

export default new VaultService(); 