import axiosClient from '../axiosClient';
import { ROUTES } from '../apiRoutes';

/**
 * Lista todas as rendas extras do usuário autenticado
 * @returns {Promise<Array>} Lista de rendas extras
 */
export const getExtraIncomes = async () => {
  const response = await axiosClient.get(ROUTES.EXTRA_INCOME.BASE);
  return response.data;
};

/**
 * Cria uma nova renda extra
 * @param {Object} data - Dados da renda extra
 * @param {number} data.amount - Valor da renda extra (em reais)
 * @param {string} data.categoryId - UUID da categoria associada
 * @param {string} [data.description] - Descrição da renda extra
 * @param {string} data.date - Data da entrada (YYYY-MM-DD)
 * @returns {Promise<Object>} Renda extra criada
 */
export const addExtraIncome = async (data) => {
  const response = await axiosClient.post(ROUTES.EXTRA_INCOME.BASE, data);
  return response.data;
}; 