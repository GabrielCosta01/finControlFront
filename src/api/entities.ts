import UserService from './services/UserService';
import CategoryService from './services/CategoryService';
import BankService from './services/BankService';
import VaultService from './services/VaultService';
import ExpenseService from './services/ExpenseService';
import ExtraIncomeService from './services/ExtraIncomeService';
import BillService from './services/BillService';
import ReceivableService from './services/ReceivableService';
import PayableService from './services/PayableService';

/**
 * Entidade de Usuário
 */
export const User = {
  list: () => UserService.getAll(),
  get: (id: string) => UserService.getById(id),
  update: (id: string, data: any) => UserService.update(id, data),
  delete: (id: string) => UserService.delete(id)
};

/**
 * Entidade de Categoria
 */
export const Category = {
  list: () => CategoryService.getAll(),
  get: (id: string) => CategoryService.getById(id),
  create: (data: any) => CategoryService.create(data),
  update: (id: string, data: any) => CategoryService.update(id, data),
  delete: (id: string) => CategoryService.delete(id),
  updateAll: (data: any) => CategoryService.updateAll(data),
  deleteAll: () => CategoryService.deleteAll()
};

/**
 * Entidade de Banco
 */
export const Bank = {
  list: () => BankService.getAll(),
  get: (id: string) => BankService.getById(id),
  create: (data: any) => BankService.create(data),
  update: (id: string, data: any) => BankService.update(id, data),
  delete: (id: string) => BankService.delete(id),
  clearIncomes: (id: string) => BankService.clearIncomes(id),
  clearExpenses: (id: string) => BankService.clearExpenses(id),
  updateAll: (data: any[]) => BankService.updateAll(data),
  addMoney: (bankId: string, amount: number) => BankService.addMoney(bankId, amount),
  removeMoney: (bankId: string, amount: number) => BankService.removeMoney(bankId, amount),
  transfer: (data: any) => BankService.transfer(data),
  addMoneyToAll: (amount: number) => BankService.addMoneyToAll(amount),
  removeMoneyFromAll: (amount: number) => BankService.removeMoneyFromAll(amount),
  getMetrics: () => BankService.getMetrics(),
  deleteAll: () => BankService.deleteAll()
};

/**
 * Entidade de Cofre
 */
export const Vault = {
  list: () => VaultService.getAll(),
  get: (id: string) => VaultService.getById(id),
  create: (data: any) => VaultService.create(data),
  update: (id: string, data: any) => VaultService.update(id, data),
  delete: (id: string) => VaultService.delete(id),
  getByBank: (bankId: string) => VaultService.getByBank(bankId)
};

/**
 * Entidade de Despesa
 */
export const Expense = {
  list: () => ExpenseService.getAll(),
  get: (id: string) => ExpenseService.getById(id),
  create: (data: any) => ExpenseService.create(data),
  update: (id: string, data: any) => ExpenseService.update(id, data),
  delete: (id: string) => ExpenseService.delete(id),
  updateAll: (data: any) => ExpenseService.updateAll(data),
  deleteAll: () => ExpenseService.deleteAll()
};

/**
 * Entidade de Renda Extra
 */
export const ExtraIncome = {
  list: () => ExtraIncomeService.getAll(),
  get: (id: string) => ExtraIncomeService.getById(id),
  create: (data: any) => ExtraIncomeService.create(data),
  update: (id: string, data: any) => ExtraIncomeService.update(id, data),
  delete: (id: string) => ExtraIncomeService.delete(id),
  updateAll: (data: any[]) => ExtraIncomeService.updateAll(data),
  deleteAll: () => ExtraIncomeService.deleteAll(),
  transfer: (data: any) => ExtraIncomeService.transfer(data),
  subtract: (id: string, amount: number) => ExtraIncomeService.subtract(id, amount),
  add: (id: string, amount: number) => ExtraIncomeService.add(id, amount),
  subtractAll: (amount: number) => ExtraIncomeService.subtractAll(amount),
  addAll: (amount: number) => ExtraIncomeService.addAll(amount),
  getByCategory: (categoryId: string) => ExtraIncomeService.getByCategory(categoryId),
  deleteByCategory: (categoryId: string) => ExtraIncomeService.deleteByCategory(categoryId),
  getByBank: (bankId: string) => ExtraIncomeService.getByBank(bankId),
  deleteByBank: (bankId: string) => ExtraIncomeService.deleteByBank(bankId)
};

/**
 * Entidade de Contas a Pagar
 */
export const Payable = {
  list: (params?: any) => PayableService.getAll(params),
  get: (id: string) => PayableService.getById(id),
  create: (data: any) => PayableService.create(data),
  update: (id: string, data: any) => PayableService.update(id, data),
  delete: (id: string) => PayableService.delete(id),
  markAsPaid: (id: string) => PayableService.markAsPaid(id)
};

/**
 * Entidade de Contas a Receber
 */
export const Receivable = {
  list: (params?: any) => ReceivableService.getAll(params),
  get: (id: string) => ReceivableService.getById(id),
  create: (data: any) => ReceivableService.create(data),
  update: (id: string, data: any) => ReceivableService.update(id, data),
  delete: (id: string) => ReceivableService.delete(id),
  markAsReceived: (id: string) => ReceivableService.markAsReceived(id)
}; 