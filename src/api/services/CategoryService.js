import axiosClient from '../axiosClient';
import { ROUTES } from '../apiRoutes';

/**
 * Obtém a lista de categorias
 * @param {Object} params - Parâmetros para filtros
 * @returns {Promise} Promise com o resultado da requisição
 */
export const getCategories = async (params = {}) => {
  try {
    const response = await axiosClient.get(ROUTES.CATEGORIES.BASE, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Obtém uma categoria específica pelo ID
 * @param {string} id - ID da categoria
 * @returns {Promise} Promise com o resultado da requisição
 */
export const getCategory = async (id) => {
  try {
    const response = await axiosClient.get(ROUTES.CATEGORIES.DETAIL(id));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Adiciona uma nova categoria
 * @param {Object} data - Dados da categoria a ser criada
 * @returns {Promise} Promise com o resultado da requisição
 */
export const addCategory = async (data) => {
  try {
    const response = await axiosClient.post(ROUTES.CATEGORIES.BASE, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Atualiza uma categoria existente
 * @param {string} id - ID da categoria
 * @param {Object} data - Dados atualizados da categoria
 * @returns {Promise} Promise com o resultado da requisição
 */
export const updateCategory = async (id, data) => {
  try {
    const response = await axiosClient.put(ROUTES.CATEGORIES.DETAIL(id), data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Remove uma categoria
 * @param {string} id - ID da categoria a ser removida
 * @returns {Promise} Promise com o resultado da requisição
 */
export const deleteCategory = async (id) => {
  try {
    const response = await axiosClient.delete(ROUTES.CATEGORIES.DETAIL(id));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}; 