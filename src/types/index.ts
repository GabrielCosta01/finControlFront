export interface BankTransferDto {
  fromBankId: string;
  toBankId: string;
  amount: number;
  description?: string;
}

export interface BankMetricsDto {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  averageBalance: number;
  bankCount: number;
  topIncomeBank?: {
    bankId: string;
    bankName: string;
    totalIncome: number;
  };
  topExpenseBank?: {
    bankId: string;
    bankName: string;
    totalExpense: number;
  };
}

export interface ExtraIncomeDto {
  id: string;
  description: string;
  amount: number;
  bankId: string;
  categoryId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExtraIncomeCreateDto {
  description: string;
  amount: number;
  bankId: string;
  categoryId?: string;
}

export interface ExtraIncomeUpdateDto {
  description?: string;
  amount?: number;
  bankId?: string;
  categoryId?: string;
}

export interface ExtraIncomeTransferDto {
  fromExtraIncomeId: string;
  toExtraIncomeId: string;
  amount: number;
  description?: string;
}

// Transações
export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL';

export interface TransactionCreateDto {
  description: string;
  amount: number;
  type: TransactionType;
  category_id?: string;
  safe_id: string;
  transaction_date: string;
}

export interface TransactionDto {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category_id?: string;
  safe_id: string;
  transaction_date: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionUpdateDto {
  description?: string;
  amount?: number;
  type?: TransactionType;
  category_id?: string;
  safe_id?: string;
  transaction_date?: string;
}

// Bank Types
export interface BankDto {
  id: string;
  name: string;
  balance: number;
  currentBalance: number;
  totalIncome: number;
  totalExpense: number;
  created_date: string;
  updated_date?: string;
}

export interface BankCreateDto {
  name: string;
  balance: number;
}

export interface BankUpdateDto {
  name?: string;
  balance?: number;
}

export interface BankTransferDto {
  amount: number;
  from_bank_id: string;
  to_bank_id: string;
  description?: string;
}

export interface BankMetricsDto {
  total_balance: number;
  total_banks: number;
  highest_balance: number;
  lowest_balance: number;
}

// Receivable Types
export interface ReceivableCreateDto {
  description: string;
  amount_total: number;
  due_date: string;
  payment_method?: string;
  category_id?: string;
  bank_id?: string;
  total_installments: number;
  status: 'PENDING' | 'RECEIVED' | 'LATE';
}

export interface ReceivableResponseDto {
  id: string;
  description: string;
  amount_total: number;
  due_date: string;
  status: 'PENDING' | 'RECEIVED' | 'LATE';
  payment_method?: string;
  category_id?: string;
  bank_id?: string;
  total_installments: number;
  created_date: string;
  updated_date?: string;
}

export interface ReceivableUpdateDto {
  description?: string;
  amount_total?: number;
  due_date?: string;
  payment_method?: string;
  category_id?: string;
  bank_id?: string;
  total_installments?: number;
  status?: ReceivableStatus;
}

export type ReceivableStatus = 'PENDING' | 'RECEIVED' | 'LATE';

// User Types
export interface LoginDto {
  email: string;
  password: string;
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  salary: number;
  created_date: string;
  updated_date?: string;
}

export interface UserRegisterDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  salary: number;
}

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  salary: number;
  created_date: string;
  updated_date?: string;
}

export interface UserSimpleDto {
  id: string;
  name: string;
  email: string;
}

// Bill Types
export interface BillCreateDto {
  expenseId: string;
  bankId?: string;
  paymentMethod: string;
  dueDate: string;
  autoPay: boolean;
}

export interface BillUpdateDto {
  description?: string;
  amount_total?: number;
  due_date?: string;
  payment_method?: string;
  category_id?: string;
  bank_id?: string;
  total_installments?: number;
  status?: 'PENDING' | 'PAID' | 'OVERDUE';
}

export interface BillResponseDto {
  id: string;
  expense: ExpenseDataDto;
  payment_method: string;
  due_date: string;
  status: BillStatus;
  bank_id?: string;
  created_date: string;
  updated_date?: string;
}

export type BillStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'PAID_LATE';

// Category Types
export interface CategoryDataDto {
  id: string;
  name: string;
  description: string;
  type: 'EXPENSE' | 'INCOME';
  createdAt: string;
  updatedAt: string;
}

export interface CategoryDetailResponseDto {
  id: string;
  description: string;
  type: 'EXPENSE' | 'INCOME';
  user: UserSimpleDto;
  category: CategoryDataDto;
  created_date: string;
  updated_date?: string;
}

export interface CategoryCreateDto {
  description: string;
  type: 'EXPENSE' | 'INCOME';
}

export interface CategoryUpdateDto {
  description?: string;
  type?: 'EXPENSE' | 'INCOME';
}

// Expense Types
export interface ExpenseDataDto {
  id: string;
  name: string;
  description: string;
  value: number;
  categoryId?: string;
  expenseDate: string;
  created_date: string;
  updated_date?: string;
}

export interface ExpenseCreateDto {
  name: string;
  description: string;
  value: number;
  categoryId?: string;
  expenseDate: string;
}

export interface ExpenseUpdateDto {
  description?: string;
  amount?: number;
  due_date?: string;
  category_id?: string;
  bank_id?: string;
  status?: 'PENDING' | 'PAID';
}

export interface ExpenseDetailResponseDto {
  id: string;
  expense: ExpenseDataDto;
  created_date: string;
  updated_date?: string;
}

// Vault Types
export interface VaultCreateDto {
  name: string;
  description: string;
  amount: number;
  currency: string;
  bank_id?: string;
}

export interface VaultUpdateDto {
  name?: string;
  description?: string;
  amount?: number;
  currency?: string;
  bank_id?: string;
}

export interface VaultDto {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  bank_id?: string;
  bank_name?: string;
  user_id: string;
  created_date: string;
  updated_date?: string;
} 