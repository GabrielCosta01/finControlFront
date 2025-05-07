import axiosClient from '../axiosClient';
import { ROUTES } from '../apiRoutes';

/**
 * Obtém a lista de usuários
 * @param {Object} params - Parâmetros para filtros e paginação
 * @returns {Promise} Promise com o resultado da requisição
 */
export const getUsers = async (params = {}) => {
  try {
    const response = await axiosClient.get(ROUTES.USERS.BASE, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Obtém um usuário específico pelo ID
 * @param {string} id - ID do usuário
 * @returns {Promise} Promise com o resultado da requisição
 */
export const getUser = async (id) => {
  try {
    const response = await axiosClient.get(ROUTES.USERS.DETAIL(id));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
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
 * Atualiza um usuário existente
 * @param {string} id - ID do usuário
 * @param {Object} data - Dados atualizados do usuário
 * @returns {Promise} Promise com o resultado da requisição
 */
export const updateUser = async (id, data) => {
  try {
    const response = await axiosClient.put(ROUTES.USERS.DETAIL(id), data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Remove um usuário
 * @param {string} id - ID do usuário a ser removido
 * @returns {Promise} Promise com o resultado da requisição
 */
export const deleteUser = async (id) => {
  try {
    const response = await axiosClient.delete(ROUTES.USERS.DETAIL(id));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}; 