export interface Card {
  id: string;
  type: 'physical' | 'virtual';
  balance: number;
  number: number;
  expDate:string,
  cvc:number,
  isFrozen:boolean
}
export interface Wallet {
  id: string;
  name:string;
  balance:number
}

export interface Transaction {
  id: string;
  amount: number;
  reason: string;
  walletAddress: string;
  date: string;
  cardId: string;
  transactionDate: string;
}

export interface User {
  email: string;
  password: string;
  fullName: string;
  address: string;
  phone: string;
  country: string;
  cards: Card[];
  transactions: Transaction[];
  wallet:Wallet,
  role: number; // 1 = Admin, 2 = Usuario normal.
  registrationDate:string,
  isBlocked:boolean
}

export interface TransactionWithUser extends Transaction {
  userEmail: string;
  userName: string;
  userRole: number;
}
