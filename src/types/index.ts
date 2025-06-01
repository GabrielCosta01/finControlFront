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