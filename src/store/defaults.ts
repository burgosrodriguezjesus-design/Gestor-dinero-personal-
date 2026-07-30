import type { Category, Settings, MonthPlan } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'alimentacion', name: 'Alimentación', icon: '🍔', isCustom: false },
  { id: 'transporte', name: 'Transporte', icon: '⛽', isCustom: false },
  { id: 'ocio', name: 'Ocio', icon: '🎮', isCustom: false },
  { id: 'compras', name: 'Compras', icon: '🛍️', isCustom: false },
  { id: 'casa', name: 'Casa', icon: '🏠', isCustom: false },
  { id: 'suscripciones', name: 'Suscripciones', icon: '📺', isCustom: false },
  { id: 'estudios', name: 'Estudios', icon: '📚', isCustom: false },
  { id: 'salud', name: 'Salud', icon: '💊', isCustom: false },
  { id: 'deudas', name: 'Deudas', icon: '💳', isCustom: false },
  { id: 'otros', name: 'Otros', icon: '📦', isCustom: false },
];

export const DEFAULT_SETTINGS: Settings = {
  darkMode: 'system',
  noOverspendMode: false,
  monthlySavingsGoal: 0,
  plannedMonthlyExpenses: 0,
  onboardingDone: false,
  currency: 'EUR',
};

export const DEFAULT_MONTH_PLAN: MonthPlan = {
  expectedIncome: 0,
  variableExpensesEstimate: 0,
  savingsGoal: 0,
};
