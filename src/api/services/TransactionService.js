import axiosClient from '../axiosClient';
import { ROUTES } from '../apiRoutes';

/**
 * Lista todas as transações do usuário autenticado
 * @returns {Promise<Array>} Lista de transações
 */
export const getTransactions = async () => {
  const response = await axiosClient.get(ROUTES.TRANSACTIONS.BASE);
  return response.data;
};

/**
 * Busca uma transação específica
 * @param {string} id ID da transação
 * @returns {Promise<Object>} Dados da transação
 */
export const getTransaction = async (id) => {
  const response = await axiosClient.get(ROUTES.TRANSACTIONS.DETAIL(id));
  return response.data;
};

/**
 * Cria uma nova transação
 * @param {Object} data Dados da transação
 * @returns {Promise<Object>} Dados da transação criada
 */
export const addTransaction = async (data) => {
  const response = await axiosClient.post(ROUTES.TRANSACTIONS.BASE, data);
  return response.data;
};

/**
 * Atualiza uma transação existente
 * @param {string} id ID da transação
 * @param {Object} data Dados atualizados da transação
 * @returns {Promise<Object>} Dados da transação atualizada
 */
export const updateTransaction = async (id, data) => {
  const response = await axiosClient.put(ROUTES.TRANSACTIONS.DETAIL(id), data);
  return response.data;
};

/**
 * Exclui uma transação
 * @param {string} id ID da transação
 * @returns {Promise<void>}
 */
export const deleteTransaction = async (id) => {
  await axiosClient.delete(ROUTES.TRANSACTIONS.DETAIL(id));
}; 