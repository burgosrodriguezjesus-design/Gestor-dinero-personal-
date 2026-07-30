import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import type {
  AppState,
  Category,
  Expense,
  Income,
  Goal,
  MonthPlan,
  Settings,
} from '../types';
import { DEFAULT_CATEGORIES, DEFAULT_SETTINGS, DEFAULT_MONTH_PLAN } from './defaults';

const todayISO = () => new Date().toISOString().slice(0, 10);

interface StoreActions {
  setInitialBalance: (amount: number) => void;
  addExpense: (input: { amount: number; categoryId: string; concept: string; date?: string }) => void;
  addIncome: (input: { amount: number; concept: string; date?: string }) => void;
  deleteTransaction: (id: string) => void;
  updateExpense: (id: string, patch: Partial<Pick<Expense, 'amount' | 'categoryId' | 'concept' | 'date'>>) => void;
  updateIncome: (id: string, patch: Partial<Pick<Income, 'amount' | 'concept' | 'date'>>) => void;
  addCategory: (name: string, icon?: string) => Category;
  setBudget: (categoryId: string, monthlyLimit: number) => void;
  addGoal: (input: { name: string; target: number; current?: number; targetDate?: string }) => void;
  updateGoal: (id: string, patch: Partial<Omit<Goal, 'id' | 'createdAt'>>) => void;
  deleteGoal: (id: string) => void;
  addToGoal: (id: string, amount: number) => void;
  addFixedExpense: (input: { name: string; amount: number; icon?: string }) => void;
  removeFixedExpense: (id: string) => void;
  addSubscription: (input: { name: string; amount: number; icon?: string }) => void;
  removeSubscription: (id: string) => void;
  addDebt: (input: { name: string; totalAmount: number; paidAmount?: number }) => void;
  removeDebt: (id: string) => void;
  payDebt: (id: string, amount: number) => void;
  setMonthPlan: (patch: Partial<MonthPlan>) => void;
  setSettings: (patch: Partial<Settings>) => void;
  exportJSON: () => string;
  importJSON: (json: string) => { ok: boolean; error?: string };
  resetAll: () => void;
}

export type Store = AppState & StoreActions;

const initialState: AppState = {
  balance: 0,
  transactions: [],
  categories: DEFAULT_CATEGORIES,
  budgets: [],
  goals: [],
  fixedExpenses: [],
  subscriptions: [],
  debts: [],
  monthPlan: DEFAULT_MONTH_PLAN,
  settings: DEFAULT_SETTINGS,
  recentConcepts: [],
};

function pushRecentConcept(list: string[], concept: string): string[] {
  const trimmed = concept.trim();
  if (!trimmed) return list;
  const filtered = list.filter((c) => c.toLowerCase() !== trimmed.toLowerCase());
  return [trimmed, ...filtered].slice(0, 12);
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...initialState,

      setInitialBalance: (amount) =>
        set((s) => ({ balance: amount, settings: { ...s.settings, onboardingDone: true } })),

      addExpense: ({ amount, categoryId, concept, date }) =>
        set((s) => {
          const expense: Expense = {
            id: uuid(),
            type: 'expense',
            amount,
            categoryId,
            concept: concept || '',
            date: date || todayISO(),
            createdAt: new Date().toISOString(),
          };
          return {
            transactions: [expense, ...s.transactions],
            balance: s.balance - amount,
            recentConcepts: pushRecentConcept(s.recentConcepts, concept),
          };
        }),

      addIncome: ({ amount, concept, date }) =>
        set((s) => {
          const income: Income = {
            id: uuid(),
            type: 'income',
            amount,
            concept: concept || '',
            date: date || todayISO(),
            createdAt: new Date().toISOString(),
          };
          return {
            transactions: [income, ...s.transactions],
            balance: s.balance + amount,
            recentConcepts: pushRecentConcept(s.recentConcepts, concept),
          };
        }),

      deleteTransaction: (id) =>
        set((s) => {
          const tx = s.transactions.find((t) => t.id === id);
          if (!tx) return {};
          const delta = tx.type === 'expense' ? tx.amount : -tx.amount;
          return {
            transactions: s.transactions.filter((t) => t.id !== id),
            balance: s.balance + delta,
          };
        }),

      updateExpense: (id, patch) =>
        set((s) => {
          const tx = s.transactions.find((t) => t.id === id && t.type === 'expense') as Expense | undefined;
          if (!tx) return {};
          const newAmount = patch.amount ?? tx.amount;
          const balanceDelta = tx.amount - newAmount;
          return {
            transactions: s.transactions.map((t) => (t.id === id ? { ...t, ...patch } : t)),
            balance: s.balance + balanceDelta,
          };
        }),

      updateIncome: (id, patch) =>
        set((s) => {
          const tx = s.transactions.find((t) => t.id === id && t.type === 'income') as Income | undefined;
          if (!tx) return {};
          const newAmount = patch.amount ?? tx.amount;
          const balanceDelta = newAmount - tx.amount;
          return {
            transactions: s.transactions.map((t) => (t.id === id ? { ...t, ...patch } : t)),
            balance: s.balance + balanceDelta,
          };
        }),

      addCategory: (name, icon = '📁') => {
        const category: Category = { id: uuid(), name, icon, isCustom: true };
        set((s) => ({ categories: [...s.categories, category] }));
        return category;
      },

      setBudget: (categoryId, monthlyLimit) =>
        set((s) => {
          const exists = s.budgets.some((b) => b.categoryId === categoryId);
          return {
            budgets: exists
              ? s.budgets.map((b) => (b.categoryId === categoryId ? { ...b, monthlyLimit } : b))
              : [...s.budgets, { categoryId, monthlyLimit }],
          };
        }),

      addGoal: ({ name, target, current = 0, targetDate }) =>
        set((s) => ({
          goals: [
            ...s.goals,
            { id: uuid(), name, target, current, targetDate, createdAt: new Date().toISOString() },
          ],
        })),

      updateGoal: (id, patch) =>
        set((s) => ({ goals: s.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)) })),

      deleteGoal: (id) => set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

      addToGoal: (id, amount) =>
        set((s) => ({
          goals: s.goals.map((g) => (g.id === id ? { ...g, current: g.current + amount } : g)),
        })),

      addFixedExpense: ({ name, amount, icon = '📌' }) =>
        set((s) => ({ fixedExpenses: [...s.fixedExpenses, { id: uuid(), name, amount, icon }] })),

      removeFixedExpense: (id) =>
        set((s) => ({ fixedExpenses: s.fixedExpenses.filter((f) => f.id !== id) })),

      addSubscription: ({ name, amount, icon = '📺' }) =>
        set((s) => ({ subscriptions: [...s.subscriptions, { id: uuid(), name, amount, icon }] })),

      removeSubscription: (id) =>
        set((s) => ({ subscriptions: s.subscriptions.filter((sub) => sub.id !== id) })),

      addDebt: ({ name, totalAmount, paidAmount = 0 }) =>
        set((s) => ({
          debts: [
            ...s.debts,
            { id: uuid(), name, totalAmount, paidAmount, createdAt: new Date().toISOString() },
          ],
        })),

      removeDebt: (id) => set((s) => ({ debts: s.debts.filter((d) => d.id !== id) })),

      payDebt: (id, amount) =>
        set((s) => {
          const debt = s.debts.find((d) => d.id === id);
          if (!debt) return {};
          const expense: Expense = {
            id: uuid(),
            type: 'expense',
            amount,
            categoryId: 'deudas',
            concept: `Pago deuda: ${debt.name}`,
            date: todayISO(),
            createdAt: new Date().toISOString(),
          };
          return {
            debts: s.debts.map((d) => (d.id === id ? { ...d, paidAmount: d.paidAmount + amount } : d)),
            transactions: [expense, ...s.transactions],
            balance: s.balance - amount,
          };
        }),

      setMonthPlan: (patch) => set((s) => ({ monthPlan: { ...s.monthPlan, ...patch } })),

      setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

      exportJSON: () => {
        const s = get();
        const data: AppState = {
          balance: s.balance,
          transactions: s.transactions,
          categories: s.categories,
          budgets: s.budgets,
          goals: s.goals,
          fixedExpenses: s.fixedExpenses,
          subscriptions: s.subscriptions,
          debts: s.debts,
          monthPlan: s.monthPlan,
          settings: s.settings,
          recentConcepts: s.recentConcepts,
        };
        return JSON.stringify(data, null, 2);
      },

      importJSON: (json) => {
        try {
          const data = JSON.parse(json);
          if (typeof data !== 'object' || data === null || !Array.isArray(data.transactions)) {
            return { ok: false, error: 'Formato de archivo no válido.' };
          }
          set({
            balance: typeof data.balance === 'number' ? data.balance : 0,
            transactions: data.transactions ?? [],
            categories: data.categories ?? DEFAULT_CATEGORIES,
            budgets: data.budgets ?? [],
            goals: data.goals ?? [],
            fixedExpenses: data.fixedExpenses ?? [],
            subscriptions: data.subscriptions ?? [],
            debts: data.debts ?? [],
            monthPlan: data.monthPlan ?? DEFAULT_MONTH_PLAN,
            settings: { ...DEFAULT_SETTINGS, ...(data.settings ?? {}), onboardingDone: true },
            recentConcepts: data.recentConcepts ?? [],
          });
          return { ok: true };
        } catch {
          return { ok: false, error: 'No se pudo leer el archivo. Comprueba que sea un JSON válido.' };
        }
      },

      resetAll: () => set(initialState),
    }),
    {
      name: 'gestor-dinero-personal-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
