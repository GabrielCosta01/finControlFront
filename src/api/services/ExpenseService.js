import axiosClient from '../axiosClient';
import { ROUTES } from '../apiRoutes';

/**
 * Lista todas as despesas do usuário autenticado
 * @returns {Promise<Array>} Lista de despesas
 */
export const getExpenses = async () => {
  const response = await axiosClient.get(ROUTES.EXPENSES.BASE);
  return response.data;
};

/**
 * Cria uma nova despesa
 * @param {Object} data - Dados da despesa
 * @param {string} data.name - Nome da despesa
 * @param {string} [data.description] - Descrição da despesa
 * @param {number} data.value - Valor da despesa
 * @param {string} data.categoryId - ID da categoria
 * @param {string} [data.bankId] - ID do banco (opcional)
 * @param {string} [data.expenseDate] - Data da despesa (YYYY-MM-DD)
 * @returns {Promise<Object>} Despesa criada
 */
export const addExpense = async (data) => {
  const response = await axiosClient.post(ROUTES.EXPENSES.BASE, data);
  return response.data;
};

/**
 * Atualiza uma despesa existente
 * @param {string} id - ID da despesa
 * @param {Object} data - Dados para atualização
 * @param {string} [data.name] - Nome da despesa
 * @param {string} [data.description] - Descrição da despesa
 * @param {number} [data.value] - Valor da despesa
 * @param {string} [data.categoryId] - ID da categoria
 * @param {string} [data.bankId] - ID do banco
 * @param {string} [data.expenseDate] - Data da despesa (YYYY-MM-DD)
 * @returns {Promise<Object>} Despesa atualizada
 */
export const updateExpense = async (id, data) => {
  const response = await axiosClient.put(ROUTES.EXPENSES.DETAIL(id), data);
  return response.data;
};

/**
 * Remove uma despesa
 * @param {string} id - ID da despesa
 * @returns {Promise<void>}
 */
export const deleteExpense = async (id) => {
  await axiosClient.delete(ROUTES.EXPENSES.DETAIL(id));
}; 