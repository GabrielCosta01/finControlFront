/**
 * Tipos de métodos de pagamento
 */
export const PaymentMethodType = {
  CASH: 'CASH',
  CARD: 'CARD',
  PIX: 'PIX',
  TRANSFER: 'TRANSFER',
  BOLETO: 'BOLETO',
  OTHER: 'OTHER'
};

/**
 * Labels para os métodos de pagamento
 */
export const PaymentMethodLabels = {
  [PaymentMethodType.CASH]: 'Dinheiro',
  [PaymentMethodType.CARD]: 'Cartão',
  [PaymentMethodType.PIX]: 'PIX',
  [PaymentMethodType.TRANSFER]: 'Transferência',
  [PaymentMethodType.BOLETO]: 'Boleto',
  [PaymentMethodType.OTHER]: 'Outro'
};

/**
 * Status para contas a pagar
 */
export const PayableStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE'
};

/**
 * Labels para os status de contas a pagar
 */
export const PayableStatusLabels = {
  [PayableStatus.PENDING]: 'Pendente',
  [PayableStatus.PAID]: 'Pago',
  [PayableStatus.OVERDUE]: 'Atrasado'
};

/**
 * Cores para os status de contas a pagar
 */
export const PayableStatusColors = {
  [PayableStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [PayableStatus.PAID]: 'bg-green-100 text-green-800 border-green-200',
  [PayableStatus.OVERDUE]: 'bg-red-100 text-red-800 border-red-200'
};

/**
 * Status para contas a receber
 */
export const ReceivableStatus = {
  PENDING: 'PENDING',
  RECEIVED: 'RECEIVED',
  LATE: 'LATE'
};

/**
 * Labels para os status de contas a receber
 */
export const ReceivableStatusLabels = {
  [ReceivableStatus.PENDING]: 'Pendente',
  [ReceivableStatus.RECEIVED]: 'Recebido',
  [ReceivableStatus.LATE]: 'Atrasado'
};

/**
 * Cores para os status de contas a receber
 */
export const ReceivableStatusColors = {
  [ReceivableStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [ReceivableStatus.RECEIVED]: 'bg-green-100 text-green-800 border-green-200',
  [ReceivableStatus.LATE]: 'bg-red-100 text-red-800 border-red-200'
};

/**
 * Tipos de transação
 */
export const TransactionType = {
  DEPOSIT: 'DEPOSIT',
  WITHDRAWAL: 'WITHDRAWAL'
};

/**
 * Labels para os tipos de transação
 */
export const TransactionTypeLabels = {
  [TransactionType.DEPOSIT]: 'Depósito',
  [TransactionType.WITHDRAWAL]: 'Saque'
}; 