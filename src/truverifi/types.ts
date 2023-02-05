export type TruverifiError = { error: string; message: string };

export type AccountResponse = {
  username: string;
  balance: number;
  transactions?: TransactionsEntity[] | null;
};

export type ClaimResponse = {
  phoneNumber: string;
  status: string;
  expirationTime: string;
  currentServices?: string[];
  sms: TruverifiSmsEntity[];
};

export type TruverifiSmsEntity = {
  id: number;
  timestamp: string;
  type: string;
  phoneNumber: string;
  text: string;
};

type TransactionsEntity = {
  id: string;
  timestamp: string;
  amount: number;
  recipient?: null;
  description: string;
};
