import axiosClient from '../axiosClient';
import { ROUTES } from '../apiRoutes';

/**
 * Obtém a lista de bancos
 * @param {Object} params - Parâmetros para filtros
 * @returns {Promise} Promise com o resultado da requisição
 */
export const getBanks = async (params = {}) => {
  try {
    const response = await axiosClient.get(ROUTES.BANKS.BASE, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Obtém um banco específico pelo ID
 * @param {string} id - ID do banco
 * @returns {Promise} Promise com o resultado da requisição
 */
export const getBank = async (id) => {
  try {
    const response = await axiosClient.get(ROUTES.BANKS.DETAIL(id));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Adiciona um novo banco
 * @param {Object} data - Dados do banco a ser criado
 * @returns {Promise} Promise com o resultado da requisição
 */
export const addBank = async (data) => {
  try {
    const response = await axiosClient.post(ROUTES.BANKS.BASE, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Atualiza um banco existente
 * @param {string} id - ID do banco
 * @param {Object} data - Dados atualizados do banco
 * @returns {Promise} Promise com o resultado da requisição
 */
export const updateBank = async (id, data) => {
  try {
    const response = await axiosClient.put(ROUTES.BANKS.DETAIL(id), data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Remove um banco
 * @param {string} id - ID do banco a ser removido
 * @returns {Promise} Promise com o resultado da requisição
 */
export const deleteBank = async (id) => {
  try {
    const response = await axiosClient.delete(ROUTES.BANKS.DETAIL(id));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}; 