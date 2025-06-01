// Definição de rotas da API para uso centralizado
const BASE_PATH = `/api`;

export const ROUTES = {
  // Autenticação
  AUTH: {
    // Rotas de autenticação públicas (sem prefixo /api)
    LOGIN: `/auth/login`,
    REGISTER: `/auth/register`,
    
    // Rotas de autenticação protegidas (com prefixo /api)
    LOGOUT: `${BASE_PATH}/auth/logout`,
    FORGOT_PASSWORD: `${BASE_PATH}/auth/forgot-password`,
    RESET_PASSWORD: `${BASE_PATH}/auth/reset-password`,
    ME: `${BASE_PATH}/auth/me`,
  },
  
  // Usuários
  USERS: {
    BASE: `${BASE_PATH}/users`,
    DETAIL: (id) => `${BASE_PATH}/users/${id}`,
  },
  
  // Categorias
  CATEGORIES: {
    BASE: `${BASE_PATH}/categories`,
    DETAIL: (id) => `${BASE_PATH}/categories/${id}`,
    UPDATE_ALL: `${BASE_PATH}/categories/user-all`,
  },
  
  // Bancos
  BANKS: {
    BASE: `${BASE_PATH}/banks`,
    DETAIL: (id) => `${BASE_PATH}/banks/${id}`,
    CLEAR_INCOMES: (id) => `${BASE_PATH}/banks/${id}/clear-incomes`,
    CLEAR_EXPENSES: (id) => `${BASE_PATH}/banks/${id}/clear-expenses`,
    UPDATE_ALL: `${BASE_PATH}/banks/update-all`,
    ADD_MONEY: (id) => `${BASE_PATH}/banks/${id}/add-money`,
    REMOVE_MONEY: (id) => `${BASE_PATH}/banks/${id}/remove-money`,
    TRANSFER: `${BASE_PATH}/banks/transfer`,
    ADD_MONEY_ALL: `${BASE_PATH}/banks/add-money-all`,
    REMOVE_MONEY_ALL: `${BASE_PATH}/banks/remove-money-all`,
    METRICS: `${BASE_PATH}/banks/metrics`,
    DELETE_ALL: `${BASE_PATH}/banks/delete-all`,
  },
  
  // Cofres (Vaults)
  VAULTS: {
    BASE: `${BASE_PATH}/vaults`,
    DETAIL: (id) => `${BASE_PATH}/vaults/${id}`,
    BY_BANK: (bankId) => `${BASE_PATH}/vaults/bank/${bankId}`,
  },
  
  // Despesas
  EXPENSES: {
    BASE: `${BASE_PATH}/expenses`,
    DETAIL: (id) => `${BASE_PATH}/expenses/${id}`,
    UPDATE_ALL: `${BASE_PATH}/expenses/user-all`,
  },

  // Renda Extra
  EXTRA_INCOME: {
    BASE: `${BASE_PATH}/extra-incomes`,
    DETAIL: (id) => `${BASE_PATH}/extra-incomes/${id}`,
    UPDATE_ALL: `${BASE_PATH}/extra-incomes`,
    DELETE_ALL: `${BASE_PATH}/extra-incomes`,
    TRANSFER: `${BASE_PATH}/extra-incomes/transfer`,
    SUBTRACT: (id) => `${BASE_PATH}/extra-incomes/${id}/subtract`,
    ADD: (id) => `${BASE_PATH}/extra-incomes/${id}/add`,
    SUBTRACT_ALL: `${BASE_PATH}/extra-incomes/subtract`,
    ADD_ALL: `${BASE_PATH}/extra-incomes/add`,
    BY_CATEGORY: (categoryId) => `${BASE_PATH}/extra-incomes/category/${categoryId}`,
    DELETE_BY_CATEGORY: (categoryId) => `${BASE_PATH}/extra-incomes/category/${categoryId}`,
    BY_BANK: (bankId) => `${BASE_PATH}/extra-incomes/bank/${bankId}`,
    DELETE_BY_BANK: (bankId) => `${BASE_PATH}/extra-incomes/bank/${bankId}`
  },
  
  // Contas a Pagar
  BILLS: {
    BASE: `${BASE_PATH}/bills`,
    DETAIL: (id) => `${BASE_PATH}/bills/${id}`,
    MARK_AS_PAID: (id) => `${BASE_PATH}/bills/${id}/pay`,
  },
  
  // Contas a Receber
  RECEIVABLES: {
    BASE: `${BASE_PATH}/receivables`,
    DETAIL: (id) => `${BASE_PATH}/receivables/${id}`,
    MARK_AS_RECEIVED: (id) => `${BASE_PATH}/receivables/${id}/receive`,
  },
  
  // Parcelas de Contas a Receber
  RECEIVABLE_INSTALLMENTS: {
    BASE: `${BASE_PATH}/receivable-installments`,
    DETAIL: (id) => `${BASE_PATH}/receivable-installments/${id}`,
  },
  
  // Transações
  TRANSACTIONS: {
    BASE: `${BASE_PATH}/transactions`,
    DETAIL: (id) => `${BASE_PATH}/transactions/${id}`,
  },
}; 