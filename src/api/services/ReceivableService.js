import axiosClient from '../axiosClient';
import { ROUTES } from '../apiRoutes';

/**
 * Obtém a lista de contas a receber
 * @param {Object} params - Parâmetros para filtros e ordenação
 * @returns {Promise} Promise com o resultado da requisição
 */
export const getReceivables = async (params = {}) => {
  try {
    const response = await axiosClient.get(ROUTES.RECEIVABLES.BASE, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Obtém uma conta a receber específica pelo ID
 * @param {string} id - ID da conta a receber
 * @returns {Promise} Promise com o resultado da requisição
 */
export const getReceivable = async (id) => {
  try {
    const response = await axiosClient.get(ROUTES.RECEIVABLES.DETAIL(id));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Adiciona uma nova conta a receber
 * @param {Object} data - Dados da conta a receber a ser criada
 * @returns {Promise} Promise com o resultado da requisição
 */
export const addReceivable = async (data) => {
  try {
    const response = await axiosClient.post(ROUTES.RECEIVABLES.BASE, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Atualiza uma conta a receber existente
 * @param {string} id - ID da conta a receber
 * @param {Object} data - Dados atualizados da conta a receber
 * @returns {Promise} Promise com o resultado da requisição
 */
export const updateReceivable = async (id, data) => {
  try {
    const response = await axiosClient.put(ROUTES.RECEIVABLES.DETAIL(id), data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Remove uma conta a receber
 * @param {string} id - ID da conta a receber a ser removida
 * @returns {Promise} Promise com o resultado da requisição
 */
export const deleteReceivable = async (id) => {
  try {
    const response = await axiosClient.delete(ROUTES.RECEIVABLES.DETAIL(id));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Obtém as parcelas de uma conta a receber específica
 * @param {string} id - ID da conta a receber
 * @returns {Promise} Promise com o resultado da requisição
 */
export const getReceivableInstallments = async (id) => {
  try {
    const response = await axiosClient.get(ROUTES.RECEIVABLES.INSTALLMENTS(id));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}; 