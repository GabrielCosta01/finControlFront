import * as UserService from './services/UserService';
import * as CategoryService from './services/CategoryService';
import * as BankService from './services/BankService';
import * as SafeService from './services/SafeService';
import * as PayableService from './services/PayableService';
import * as ReceivableService from './services/ReceivableService';
import * as TransactionService from './services/TransactionService';

/**
 * Entidade de Usuário
 */
export const User = {
  list: UserService.getUsers,
  get: UserService.getUser,
  create: UserService.addUser,
  update: UserService.updateUser,
  delete: UserService.deleteUser
};

/**
 * Entidade de Categoria
 */
export const Category = {
  list: CategoryService.getCategories,
  get: CategoryService.getCategory,
  create: CategoryService.addCategory,
  update: CategoryService.updateCategory,
  delete: CategoryService.deleteCategory
};

/**
 * Entidade de Banco
 */
export const Bank = {
  list: BankService.getBanks,
  get: BankService.getBank,
  create: BankService.addBank,
  update: BankService.updateBank,
  delete: BankService.deleteBank
};

/**
 * Entidade de Cofre
 */
export const Safe = {
  list: SafeService.getSafes,
  get: SafeService.getSafe,
  create: SafeService.addSafe,
  update: SafeService.updateSafe,
  delete: SafeService.deleteSafe
};

/**
 * Entidade de Conta a Pagar
 */
export const Payable = {
  list: PayableService.getPayables,
  get: PayableService.getPayable,
  create: PayableService.addPayable,
  update: PayableService.updatePayable,
  delete: PayableService.deletePayable,
  getParcels: PayableService.getPayableParcels
};

/**
 * Entidade de Conta a Receber
 */
export const Receivable = {
  list: ReceivableService.getReceivables,
  get: ReceivableService.getReceivable,
  create: ReceivableService.addReceivable,
  update: ReceivableService.updateReceivable,
  delete: ReceivableService.deleteReceivable,
  getInstallments: ReceivableService.getReceivableInstallments
};

/**
 * Entidade de Transação
 */
export const Transaction = {
  list: TransactionService.getTransactions,
  get: TransactionService.getTransaction,
  create: TransactionService.addTransaction,
  update: TransactionService.updateTransaction,
  delete: TransactionService.deleteTransaction
}; 