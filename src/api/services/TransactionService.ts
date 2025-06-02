import axiosClient from '../axiosClient';
import { ROUTES } from '../apiRoutes';
import type { TransactionCreateDto, TransactionDto, TransactionUpdateDto } from '../../types';

/**
 * Lista todas as transações do usuário autenticado
 * @returns {Promise<TransactionDto[]>} Lista de transações
 */
export const getTransactions = async (): Promise<TransactionDto[]> => {
  const response = await axiosClient.get(ROUTES.TRANSACTIONS.BASE);
  return response.data;
};

/**
 * Busca uma transação específica
 * @param {string} id ID da transação
 * @returns {Promise<TransactionDto>} Dados da transação
 */
export const getTransaction = async (id: string): Promise<TransactionDto> => {
  const response = await axiosClient.get(ROUTES.TRANSACTIONS.DETAIL(id));
  return response.data;
};

/**
 * Cria uma nova transação
 * @param {TransactionCreateDto} data Dados da transação
 * @returns {Promise<TransactionDto>} Dados da transação criada
 */
export const addTransaction = async (data: TransactionCreateDto): Promise<TransactionDto> => {
  try {
    const response = await axiosClient.post(ROUTES.TRANSACTIONS.BASE, data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * Atualiza uma transação existente
 * @param {string} id ID da transação
 * @param {TransactionUpdateDto} data Dados atualizados da transação
 * @returns {Promise<TransactionDto>} Dados da transação atualizada
 */
export const updateTransaction = async (id: string, data: TransactionUpdateDto): Promise<TransactionDto> => {
  const response = await axiosClient.put(ROUTES.TRANSACTIONS.DETAIL(id), data);
  return response.data;
};

/**
 * Exclui uma transação
 * @param {string} id ID da transação
 * @returns {Promise<void>}
 */
export const deleteTransaction = async (id: string): Promise<void> => {
  await axiosClient.delete(ROUTES.TRANSACTIONS.DETAIL(id));
}; 