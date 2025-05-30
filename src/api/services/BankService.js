import axiosClient from '../axiosClient';
import { ROUTES } from '../apiRoutes';

/**
 * Lista todos os bancos
 * @returns {Promise<Array>} Lista de bancos
 */
export const getBanks = async () => {
  const response = await axiosClient.get(ROUTES.BANKS.BASE);
  return response.data;
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
 * Cria um novo banco
 * @param {Object} data - Dados do banco
 * @param {string} data.name - Nome do banco (obrigatório)
 * @param {string} [data.description] - Descrição do banco
 * @param {number} [data.initialBalance] - Saldo inicial do banco
 * @returns {Promise<Object>} Banco criado
 */
export const addBank = async (data) => {
  const response = await axiosClient.post(ROUTES.BANKS.BASE, data);
  return response.data;
};

/**
 * Atualiza um banco existente
 * @param {string} id - ID do banco
 * @param {Object} data - Dados para atualização
 * @param {string} [data.name] - Novo nome do banco
 * @param {string} [data.description] - Nova descrição do banco
 * @param {number} [data.balance] - Novo saldo do banco
 * @returns {Promise<Object>} Banco atualizado
 */
export const updateBank = async (id, data) => {
  const response = await axiosClient.put(ROUTES.BANKS.DETAIL(id), data);
  return response.data;
};

/**
 * Remove um banco e todas suas receitas e despesas associadas
 * @param {string} id - ID do banco
 * @returns {Promise<void>}
 */
export const deleteBank = async (id) => {
  await axiosClient.delete(ROUTES.BANKS.DETAIL(id));
};

/**
 * Remove todas as receitas associadas a um banco
 * @param {string} id - ID do banco
 * @returns {Promise<void>}
 */
export const clearIncomes = async (id) => {
  await axiosClient.delete(ROUTES.BANKS.CLEAR_INCOMES(id));
};

/**
 * Remove todas as despesas associadas a um banco
 * @param {string} id - ID do banco
 * @returns {Promise<void>}
 */
export const clearExpenses = async (id) => {
  await axiosClient.delete(ROUTES.BANKS.CLEAR_EXPENSES(id));
}; 