import { create } from 'zustand';

export type SheetKind = 'expense' | 'income' | 'goal' | 'fixed' | 'fab-menu' | null;

interface UIState {
  openSheet: SheetKind;
  editingExpenseId: string | null;
  editingIncomeId: string | null;
  setSheet: (sheet: SheetKind) => void;
  editExpense: (id: string) => void;
  editIncome: (id: string) => void;
  closeSheet: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  openSheet: null,
  editingExpenseId: null,
  editingIncomeId: null,
  setSheet: (sheet) => set({ openSheet: sheet }),
  editExpense: (id) => set({ openSheet: 'expense', editingExpenseId: id }),
  editIncome: (id) => set({ openSheet: 'income', editingIncomeId: id }),
  closeSheet: () => set({ openSheet: null, editingExpenseId: null, editingIncomeId: null }),
}));
