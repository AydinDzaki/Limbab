export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Di real app ini harus di-hash!
  role: 'Pemilik' | 'Akuntan' | 'Kasir';
  token?: string;
}

export interface Transaction {
  id: number;
  type: 'income' | 'expense' | 'receivable' | 'debt';
  description: string;
  amount: number;
  date: string; 
  category: string;
  contact?: string;
  hasReceipt?: boolean;
}

export interface FinancialSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  monthlyGrowth: number;
  accountNumber: string;
}

export interface DebtEntry {
  id: number;
  type: 'utang' | 'piutang';
  customerSupplierName: string;
  amount: number;
  dueDate: string;
  description: string;
  status: 'belum_lunas' | 'lunas';
  createdDate: string;
}