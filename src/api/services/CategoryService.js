import axiosClient from '../axiosClient';
import { ROUTES } from '../apiRoutes';

/**
 * Lista todas as categorias do usuário autenticado
 * @returns {Promise<Array>} Lista de categorias
 */
export const getCategories = async () => {
  const response = await axiosClient.get(ROUTES.CATEGORIES.BASE);
  return response.data;
};

/**
 * Busca uma categoria por ID
 * @param {string} id - ID da categoria
 * @returns {Promise<Object>} Dados da categoria
 */
export const getCategory = async (id) => {
  const response = await axiosClient.get(ROUTES.CATEGORIES.DETAIL(id));
  return response.data;
};

/**
 * Cria uma nova categoria
 * @param {Object} data - Dados da categoria
 * @param {string} data.name - Nome da categoria (obrigatório)
 * @param {string} [data.description] - Descrição da categoria (opcional)
 * @returns {Promise<Object>} Categoria criada
 */
export const addCategory = async (data) => {
  const response = await axiosClient.post(ROUTES.CATEGORIES.BASE, data);
  return response.data;
};

/**
 * Atualiza uma categoria existente
 * @param {string} id - ID da categoria
 * @param {Object} data - Dados para atualização
 * @param {string} [data.name] - Novo nome da categoria
 * @param {string} [data.description] - Nova descrição da categoria
 * @returns {Promise<Object>} Categoria atualizada
 */
export const updateCategory = async (id, data) => {
  const response = await axiosClient.put(ROUTES.CATEGORIES.DETAIL(id), data);
  return response.data;
};

/**
 * Remove uma categoria
 * @param {string} id - ID da categoria
 * @returns {Promise<void>}
 */
export const deleteCategory = async (id) => {
  await axiosClient.delete(ROUTES.CATEGORIES.DETAIL(id));
}; 