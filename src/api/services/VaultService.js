import axiosClient from '../axiosClient';
import { ROUTES } from '../apiRoutes';

/**
 * Lista todos os cofres do usuário autenticado
 * @returns {Promise<Array>} Lista de cofres
 */
export const getVaults = async () => {
  const response = await axiosClient.get(ROUTES.VAULTS.BASE);
  return response.data;
};

/**
 * Busca um cofre específico pelo ID
 * @param {string} id - ID do cofre
 * @returns {Promise<Object>} Dados do cofre
 */
export const getVault = async (id) => {
  const response = await axiosClient.get(ROUTES.VAULTS.DETAIL(id));
  return response.data;
};

/**
 * Lista todos os cofres vinculados a um banco específico
 * @param {string} bankId - ID do banco
 * @returns {Promise<Array>} Lista de cofres do banco
 */
export const getVaultsByBank = async (bankId) => {
  const response = await axiosClient.get(ROUTES.VAULTS.BY_BANK(bankId));
  return response.data;
};

/**
 * Cria um novo cofre
 * @param {Object} data - Dados do cofre
 * @param {string} data.name - Nome do cofre
 * @param {string} [data.description] - Descrição do cofre
 * @param {number} data.initialAmount - Valor inicial do cofre
 * @param {string} data.currency - Moeda do cofre (ex: BRL, USD)
 * @param {string} [data.bankId] - ID do banco de onde o valor inicial será retirado
 * @returns {Promise<Object>} Cofre criado
 */
export const addVault = async (data) => {
  const response = await axiosClient.post(ROUTES.VAULTS.BASE, data);
  return response.data;
};

/**
 * Atualiza um cofre existente
 * @param {string} id - ID do cofre
 * @param {Object} data - Dados para atualização
 * @param {string} [data.name] - Novo nome do cofre
 * @param {string} [data.description] - Nova descrição do cofre
 * @param {string} [data.currency] - Nova moeda do cofre
 * @returns {Promise<Object>} Cofre atualizado
 */
export const updateVault = async (id, data) => {
  const response = await axiosClient.put(ROUTES.VAULTS.DETAIL(id), data);
  return response.data;
};

/**
 * Remove um cofre
 * @param {string} id - ID do cofre
 * @returns {Promise<void>}
 */
export const deleteVault = async (id) => {
  await axiosClient.delete(ROUTES.VAULTS.DETAIL(id));
}; 