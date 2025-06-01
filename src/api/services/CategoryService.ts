import axiosClient from '../axiosClient';
import { ROUTES } from '../apiRoutes.js';
import type { CategoryCreateDto, CategoryUpdateDto, CategoryDetailResponseDto } from '../../types';

class CategoryService {
  async getAll(): Promise<CategoryDetailResponseDto[]> {
    const response = await axiosClient.get(ROUTES.CATEGORIES.BASE);
    return response.data;
  }

  async getById(id: string): Promise<CategoryDetailResponseDto> {
    const response = await axiosClient.get(ROUTES.CATEGORIES.DETAIL(id));
    return response.data;
  }

  async create(data: CategoryCreateDto): Promise<CategoryDetailResponseDto> {
    const response = await axiosClient.post(ROUTES.CATEGORIES.BASE, data);
    return response.data;
  }

  async update(id: string, data: CategoryUpdateDto): Promise<CategoryDetailResponseDto> {
    const response = await axiosClient.put(ROUTES.CATEGORIES.DETAIL(id), data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axiosClient.delete(ROUTES.CATEGORIES.DETAIL(id));
  }

  async updateAll(data: CategoryUpdateDto): Promise<CategoryDetailResponseDto[]> {
    const response = await axiosClient.put(ROUTES.CATEGORIES.UPDATE_ALL, data);
    return response.data;
  }

  async deleteAll(): Promise<void> {
    await axiosClient.delete(ROUTES.CATEGORIES.UPDATE_ALL);
  }
}

export default new CategoryService(); 