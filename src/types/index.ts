export type CategoryId = string;

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  isCustom: boolean;
}

export interface Expense {
  id: string;
  type: 'expense';
  amount: number;
  categoryId: CategoryId;
  concept: string;
  date: string; // ISO yyyy-MM-dd
  createdAt: string; // ISO datetime
}

export interface Income {
  id: string;
  type: 'income';
  amount: number;
  concept: string;
  date: string;
  createdAt: string;
}

export type Transaction = Expense | Income;

export interface Budget {
  categoryId: CategoryId;
  monthlyLimit: number;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  targetDate?: string; // ISO date
  createdAt: string;
}

export interface FixedExpense {
  id: string;
  name: string;
  amount: number; // monthly amount
  icon: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number; // monthly amount
  icon: string;
}

export interface Debt {
  id: string;
  name: string;
  totalAmount: number;
  paidAmount: number;
  createdAt: string;
}

export interface MonthPlan {
  expectedIncome: number;
  variableExpensesEstimate: number;
  savingsGoal: number;
}

export interface Settings {
  darkMode: 'system' | 'light' | 'dark';
  noOverspendMode: boolean;
  monthlySavingsGoal: number; // used for "Puedes gastar"
  plannedMonthlyExpenses: number; // used for "Puedes gastar"
  onboardingDone: boolean;
  currency: string;
}

export interface AppState {
  balance: number;
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  goals: Goal[];
  fixedExpenses: FixedExpense[];
  subscriptions: Subscription[];
  debts: Debt[];
  monthPlan: MonthPlan;
  settings: Settings;
  recentConcepts: string[];
}
