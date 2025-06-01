// Tipos comuns
export interface UserSimpleDto {
  id: string;
  name: string;
}

export interface CategorySimpleDto {
  id: string;
  name: string;
}

export interface BankSimpleDto {
  id: string;
  name: string;
}

// Autenticação
export interface LoginDto {
  email: string;
  password: string;
}

export interface UserRegisterDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  salary: number;
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  salary: number;
  createdAt: string;
  updatedAt: string;
}

// Categorias
export interface CategoryCreateDto {
  name: string;
  description?: string;
}

export interface CategoryUpdateDto {
  name?: string;
  description?: string;
}

export interface CategoryDataDto {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryDetailResponseDto {
  user: UserSimpleDto;
  category: CategoryDataDto;
}

// Bancos
export interface BankCreateDto {
  name: string;
  description?: string;
  initialBalance?: number;
}

export interface BankUpdateDto {
  name?: string;
  description?: string;
  balance?: number;
}

export interface BankDto {
  id: string;
  name: string;
  description: string;
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
  createdAt: string;
  updatedAt: string;
}

// Cofres
export interface VaultCreateDto {
  name: string;
  description?: string;
  initialAmount: number;
  currency: string;
  bankId?: string;
}

export interface VaultUpdateDto {
  name?: string;
  description?: string;
  currency?: string;
}

export interface VaultDto {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  bankId?: string;
  bankName?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Despesas
export interface ExpenseCreateDto {
  name: string;
  description?: string;
  value: number;
  categoryId: string;
  bankId?: string;
  expenseDate: string;
}

export interface ExpenseUpdateDto {
  name?: string;
  description?: string;
  value?: number;
  categoryId?: string;
  bankId?: string;
  expenseDate?: string;
}

export interface ExpenseDataDto {
  id: string;
  name: string;
  description: string;
  value: number;
  expenseDate: string;
  category: CategorySimpleDto;
  bank?: BankSimpleDto;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseDetailResponseDto {
  user: UserSimpleDto;
  expense: ExpenseDataDto;
}

// Renda Extra
export interface ExtraIncomeDto {
  amount: number;
  categoryId: string;
  description?: string;
  date: string;
}

export interface ExtraIncomeSimpleDto {
  id: number;
  description: string;
  value: number;
  bankId?: string;
  bankName?: string;
}

// Contas a Pagar
export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PIX = 'PIX',
  BANK_SLIP = 'BANK_SLIP',
  CHECK = 'CHECK',
  LOAN = 'LOAN',
  TRANSFER = 'TRANSFER',
  CRYPTOCURRENCY = 'CRYPTOCURRENCY',
  OTHER = 'OTHER'
}

export enum BillStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  PAID_LATE = 'PAID_LATE'
}

export interface BillCreateDto {
  expenseId: string;
  bankId?: string;
  paymentMethod: PaymentMethod;
  dueDate: string;
  autoPay: boolean;
}

export interface BillUpdateDto {
  expenseId?: string;
  bankId?: string;
  paymentMethod?: PaymentMethod;
  dueDate?: string;
  autoPay?: boolean;
}

export interface BillResponseDto {
  id: string;
  user: UserSimpleDto;
  expense: ExpenseDataDto;
  bank?: BankSimpleDto;
  paymentMethod: PaymentMethod;
  dueDate: string;
  autoPay: boolean;
  status: BillStatus;
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Contas a Receber
export enum ReceivableStatus {
  PENDING = 'PENDING',
  RECEIVED = 'RECEIVED',
  OVERDUE = 'OVERDUE',
  RECEIVED_LATE = 'RECEIVED_LATE'
}

export interface ReceivableCreateDto {
  extraIncomeId: number;
  receiptMethod: PaymentMethod;
  dueDate: string;
  automaticBankReceipt: boolean;
}

export interface ReceivableUpdateDto {
  receiptMethod?: PaymentMethod;
  dueDate?: string;
  automaticBankReceipt?: boolean;
}

export interface ReceivableResponseDto {
  id: string;
  user: UserSimpleDto;
  extraIncome: ExtraIncomeSimpleDto;
  bank?: BankSimpleDto;
  receiptMethod: PaymentMethod;
  dueDate: string;
  automaticBankReceipt: boolean;
  status: ReceivableStatus;
  receivedDate?: string;
  createdAt: string;
  updatedAt: string;
}
