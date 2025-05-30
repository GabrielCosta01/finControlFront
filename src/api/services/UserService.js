import axiosClient from '../axiosClient';
import { ROUTES } from '../apiRoutes';

/**
 * Lista todos os usuários
 * @returns {Promise<Array>} Lista de usuários
 */
export const getUsers = async () => {
  const response = await axiosClient.get(ROUTES.USERS.BASE);
  return response.data;
};

/**
 * Busca um usuário por ID
 * @param {string} id - ID do usuário
 * @returns {Promise<Object>} Dados do usuário
 */
export const getUser = async (id) => {
  const response = await axiosClient.get(ROUTES.USERS.DETAIL(id));
  return response.data;
};

/**
 * Adiciona um novo usuário
 * @param {Object} data - Dados do usuário a ser criado
 * @returns {Promise} Promise com o resultado da requisição
 */
export const addUser = async (data) => {
  try {
    const response = await axiosClient.post(ROUTES.USERS.BASE, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Atualiza dados de um usuário
 * @param {string} id - ID do usuário
 * @param {Object} data - Dados para atualização
 * @param {string} [data.name] - Nome do usuário
 * @param {string} [data.password] - Nova senha
 * @param {number} [data.salary] - Novo salário
 * @returns {Promise<Object>} Usuário atualizado
 */
export const updateUser = async (id, data) => {
  const response = await axiosClient.put(ROUTES.USERS.DETAIL(id), data);
  return response.data;
};

/**
 * Remove um usuário
 * @param {string} id - ID do usuário
 * @returns {Promise<void>}
 */
export const deleteUser = async (id) => {
  await axiosClient.delete(ROUTES.USERS.DETAIL(id));
}; 