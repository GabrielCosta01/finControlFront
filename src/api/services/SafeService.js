import axiosClient from '../axiosClient';
import { ROUTES } from '../apiRoutes';

/**
 * Obtém a lista de cofres
 * @param {Object} params - Parâmetros para filtros
 * @returns {Promise} Promise com o resultado da requisição
 */
export const getSafes = async (params = {}) => {
  try {
    const response = await axiosClient.get(ROUTES.SAFES.BASE, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Obtém um cofre específico pelo ID
 * @param {string} id - ID do cofre
 * @returns {Promise} Promise com o resultado da requisição
 */
export const getSafe = async (id) => {
  try {
    const response = await axiosClient.get(ROUTES.SAFES.DETAIL(id));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Adiciona um novo cofre
 * @param {Object} data - Dados do cofre a ser criado
 * @returns {Promise} Promise com o resultado da requisição
 */
export const addSafe = async (data) => {
  try {
    const response = await axiosClient.post(ROUTES.SAFES.BASE, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Atualiza um cofre existente
 * @param {string} id - ID do cofre
 * @param {Object} data - Dados atualizados do cofre
 * @returns {Promise} Promise com o resultado da requisição
 */
export const updateSafe = async (id, data) => {
  try {
    const response = await axiosClient.put(ROUTES.SAFES.DETAIL(id), data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Remove um cofre
 * @param {string} id - ID do cofre a ser removido
 * @returns {Promise} Promise com o resultado da requisição
 */
export const deleteSafe = async (id) => {
  try {
    const response = await axiosClient.delete(ROUTES.SAFES.DETAIL(id));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}; 