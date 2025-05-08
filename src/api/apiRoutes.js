// Definição de rotas da API para uso centralizado
const API_VERSION = 'v1';
const BASE_PATH = `/api/${API_VERSION}`;

export const ROUTES = {
  // Autenticação
  AUTH: {
    LOGIN: `${BASE_PATH}/auth/login`,
    LOGOUT: `${BASE_PATH}/auth/logout`,
    REGISTER: `${BASE_PATH}/auth/register`,
    FORGOT_PASSWORD: `${BASE_PATH}/auth/forgot-password`,
    RESET_PASSWORD: `${BASE_PATH}/auth/reset-password`,
    ME: `${BASE_PATH}/auth/me`,
  },
  
  // Usuários
  USERS: {
    BASE: `${BASE_PATH}/api/users`,
    DETAIL: (id) => `${BASE_PATH}/api/users/${id}`,
  },
  
  // Categorias
  CATEGORIES: {
    BASE: `${BASE_PATH}/api/categories`,
    DETAIL: (id) => `${BASE_PATH}/categories/${id}`,
  },
  
  // Bancos
  BANKS: {
    BASE: `${BASE_PATH}/banks`,
    DETAIL: (id) => `${BASE_PATH}/banks/${id}`,
  },
  
  // Cofres
  SAFES: {
    BASE: `${BASE_PATH}/safes`,
    DETAIL: (id) => `${BASE_PATH}/safes/${id}`,
  },
  
  // Contas a Pagar
  PAYABLES: {
    BASE: `${BASE_PATH}/payables`,
    DETAIL: (id) => `${BASE_PATH}/payables/${id}`,
    PARCELS: (id) => `${BASE_PATH}/payables/${id}/parcels`,
  },
  
  // Parcelas de Contas a Pagar
  PAYABLE_PARCELS: {
    BASE: `${BASE_PATH}/payable-parcels`,
    DETAIL: (id) => `${BASE_PATH}/payable-parcels/${id}`,
  },
  
  // Contas a Receber
  RECEIVABLES: {
    BASE: `${BASE_PATH}/receivables`,
    DETAIL: (id) => `${BASE_PATH}/receivables/${id}`,
    INSTALLMENTS: (id) => `${BASE_PATH}/receivables/${id}/installments`,
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