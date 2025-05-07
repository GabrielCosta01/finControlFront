import axiosClient from '../axiosClient';
import { ROUTES } from '../apiRoutes';

/**
 * Obtém a lista de contas a pagar
 * @param {Object} params - Parâmetros para filtros e ordenação
 * @returns {Promise} Promise com o resultado da requisição
 */
export const getPayables = async (params = {}) => {
  try {
    const response = await axiosClient.get(ROUTES.PAYABLES.BASE, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Obtém uma conta a pagar específica pelo ID
 * @param {string} id - ID da conta a pagar
 * @returns {Promise} Promise com o resultado da requisição
 */
export const getPayable = async (id) => {
  try {
    const response = await axiosClient.get(ROUTES.PAYABLES.DETAIL(id));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Adiciona uma nova conta a pagar
 * @param {Object} data - Dados da conta a pagar a ser criada
 * @returns {Promise} Promise com o resultado da requisição
 */
export const addPayable = async (data) => {
  try {
    const response = await axiosClient.post(ROUTES.PAYABLES.BASE, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Atualiza uma conta a pagar existente
 * @param {string} id - ID da conta a pagar
 * @param {Object} data - Dados atualizados da conta a pagar
 * @returns {Promise} Promise com o resultado da requisição
 */
export const updatePayable = async (id, data) => {
  try {
    const response = await axiosClient.put(ROUTES.PAYABLES.DETAIL(id), data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Remove uma conta a pagar
 * @param {string} id - ID da conta a pagar a ser removida
 * @returns {Promise} Promise com o resultado da requisição
 */
export const deletePayable = async (id) => {
  try {
    const response = await axiosClient.delete(ROUTES.PAYABLES.DETAIL(id));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Obtém as parcelas de uma conta a pagar específica
 * @param {string} id - ID da conta a pagar
 * @returns {Promise} Promise com o resultado da requisição
 */
export const getPayableParcels = async (id) => {
  try {
    const response = await axiosClient.get(ROUTES.PAYABLES.PARCELS(id));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}; 