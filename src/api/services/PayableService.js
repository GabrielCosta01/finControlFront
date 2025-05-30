import axiosClient from '../axiosClient';
import { ROUTES } from '../apiRoutes';

/**
 * Lista todas as contas a pagar do usuário autenticado
 * @returns {Promise<Array>} Lista de contas a pagar
 */
export const getPayables = async () => {
  const response = await axiosClient.get(ROUTES.PAYABLES.BASE);
  return response.data;
};

/**
 * Busca uma conta a pagar específica
 * @param {string} id ID da conta a pagar
 * @returns {Promise<Object>} Dados da conta a pagar
 */
export const getPayable = async (id) => {
  const response = await axiosClient.get(ROUTES.PAYABLES.DETAIL(id));
  return response.data;
};

/**
 * Cria uma nova conta a pagar
 * @param {Object} data Dados da conta a pagar
 * @returns {Promise<Object>} Dados da conta a pagar criada
 */
export const addPayable = async (data) => {
  const response = await axiosClient.post(ROUTES.PAYABLES.BASE, data);
  return response.data;
};

/**
 * Atualiza uma conta a pagar existente
 * @param {string} id ID da conta a pagar
 * @param {Object} data Dados atualizados da conta a pagar
 * @returns {Promise<Object>} Dados da conta a pagar atualizada
 */
export const updatePayable = async (id, data) => {
  const response = await axiosClient.put(ROUTES.PAYABLES.DETAIL(id), data);
  return response.data;
};

/**
 * Exclui uma conta a pagar
 * @param {string} id ID da conta a pagar
 * @returns {Promise<void>}
 */
export const deletePayable = async (id) => {
  await axiosClient.delete(ROUTES.PAYABLES.DETAIL(id));
}; 