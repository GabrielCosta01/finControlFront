import axiosClient from '../axiosClient';
import { ROUTES } from '../apiRoutes';

/**
 * Lista todas as contas a receber do usuário autenticado
 * @returns {Promise<Array>} Lista de contas a receber
 */
export const getReceivables = async () => {
  const response = await axiosClient.get(ROUTES.RECEIVABLES.BASE);
  return response.data;
};

/**
 * Busca uma conta a receber específica
 * @param {string} id ID da conta a receber
 * @returns {Promise<Object>} Dados da conta a receber
 */
export const getReceivable = async (id) => {
  const response = await axiosClient.get(ROUTES.RECEIVABLES.DETAIL(id));
  return response.data;
};

/**
 * Cria uma nova conta a receber
 * @param {Object} data Dados da conta a receber
 * @returns {Promise<Object>} Dados da conta a receber criada
 */
export const addReceivable = async (data) => {
  const response = await axiosClient.post(ROUTES.RECEIVABLES.BASE, data);
  return response.data;
};

/**
 * Atualiza uma conta a receber existente
 * @param {string} id ID da conta a receber
 * @param {Object} data Dados atualizados da conta a receber
 * @returns {Promise<Object>} Dados da conta a receber atualizada
 */
export const updateReceivable = async (id, data) => {
  const response = await axiosClient.put(ROUTES.RECEIVABLES.DETAIL(id), data);
  return response.data;
};

/**
 * Exclui uma conta a receber
 * @param {string} id ID da conta a receber
 * @returns {Promise<void>}
 */
export const deleteReceivable = async (id) => {
  await axiosClient.delete(ROUTES.RECEIVABLES.DETAIL(id));
}; 