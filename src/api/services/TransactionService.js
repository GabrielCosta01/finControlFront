import axiosClient from '../axiosClient';
import { ROUTES } from '../apiRoutes';

/**
 * Obtém a lista de transações
 * @param {string|Object} params - Parâmetros para filtros ou ordem de ordenação
 * @returns {Promise} Promise com o resultado da requisição
 */
export const getTransactions = async (params = {}) => {
  try {
    // Suporte para passar apenas uma string de ordenação ou um objeto completo
    const queryParams = typeof params === 'string' 
      ? { sort: params } 
      : params;
    
    const response = await axiosClient.get(ROUTES.TRANSACTIONS.BASE, { params: queryParams });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Obtém uma transação específica pelo ID
 * @param {string} id - ID da transação
 * @returns {Promise} Promise com o resultado da requisição
 */
export const getTransaction = async (id) => {
  try {
    const response = await axiosClient.get(ROUTES.TRANSACTIONS.DETAIL(id));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Adiciona uma nova transação
 * @param {Object} data - Dados da transação a ser criada
 * @returns {Promise} Promise com o resultado da requisição
 */
export const addTransaction = async (data) => {
  try {
    const response = await axiosClient.post(ROUTES.TRANSACTIONS.BASE, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Atualiza uma transação existente
 * @param {string} id - ID da transação
 * @param {Object} data - Dados atualizados da transação
 * @returns {Promise} Promise com o resultado da requisição
 */
export const updateTransaction = async (id, data) => {
  try {
    const response = await axiosClient.put(ROUTES.TRANSACTIONS.DETAIL(id), data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Remove uma transação
 * @param {string} id - ID da transação a ser removida
 * @returns {Promise} Promise com o resultado da requisição
 */
export const deleteTransaction = async (id) => {
  try {
    const response = await axiosClient.delete(ROUTES.TRANSACTIONS.DETAIL(id));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}; 