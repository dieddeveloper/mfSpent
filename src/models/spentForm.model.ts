export interface SpentFormData {
  name: string;
  value: number;
  description: string;
  startDate: string;
  endDate: string;
  paymentMethod: string;
  paymentInstallments: number;
  link?: string;
  noveltyType?: NoveltyType;
  userId?: number;
  top?: number;
}

export enum NoveltyType {
  SPENT = 0,
  INCOME = 1,
  OBJECTIVE = 2,
  DEBT = 3,
  SUBSCRIPTION = 4,
}

export enum PaymentMethod {
  CASH = 0,
  CREDIT_CARD = 1,
  BANK_TRANSFER = 2,
  OTHER = 3,
}
