import * as UserService from './services/UserService';
import * as CategoryService from './services/CategoryService';
import * as BankService from './services/BankService';
import * as VaultService from './services/VaultService';
import * as ExpenseService from './services/ExpenseService';
import * as ExtraIncomeService from './services/ExtraIncomeService';
import * as PayableService from './services/PayableService';
import * as ReceivableService from './services/ReceivableService';
import * as TransactionService from './services/TransactionService';

/**
 * Entidade de Usuário
 */
export const User = {
  list: UserService.getUsers,
  get: UserService.getUser,
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
  create: BankService.addBank,
  update: BankService.updateBank,
  delete: BankService.deleteBank,
  clearIncomes: BankService.clearIncomes,
  clearExpenses: BankService.clearExpenses
};

/**
 * Entidade de Cofre
 */
export const Vault = {
  list: VaultService.getVaults,
  get: VaultService.getVault,
  create: VaultService.addVault,
  update: VaultService.updateVault,
  delete: VaultService.deleteVault,
  getByBank: VaultService.getVaultsByBank
};

/**
 * Entidade de Despesa
 */
export const Expense = {
  list: ExpenseService.getExpenses,
  create: ExpenseService.addExpense,
  update: ExpenseService.updateExpense,
  delete: ExpenseService.deleteExpense
};

/**
 * Entidade de Renda Extra
 */
export const ExtraIncome = {
  list: ExtraIncomeService.getExtraIncomes,
  create: ExtraIncomeService.addExtraIncome
};

/**
 * Entidade de Contas a Pagar
 */
export const Payable = {
  list: PayableService.getPayables,
  get: PayableService.getPayable,
  create: PayableService.addPayable,
  update: PayableService.updatePayable,
  delete: PayableService.deletePayable
};

/**
 * Entidade de Contas a Receber
 */
export const Receivable = {
  list: ReceivableService.getReceivables,
  get: ReceivableService.getReceivable,
  create: ReceivableService.addReceivable,
  update: ReceivableService.updateReceivable,
  delete: ReceivableService.deleteReceivable
};

/**
 * Entidade de Transações
 */
export const Transaction = {
  list: TransactionService.getTransactions,
  get: TransactionService.getTransaction,
  create: TransactionService.addTransaction,
  update: TransactionService.updateTransaction,
  delete: TransactionService.deleteTransaction
}; 