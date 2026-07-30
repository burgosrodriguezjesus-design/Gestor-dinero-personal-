import type { Transaction, Expense, Category, Budget, Goal } from '../types';
import { isThisMonth, isLastMonth, daysLeftInMonth, totalDaysInMonth, isToday, format, parseISO } from './dates';
import { MONTH_NAMES_ES } from './dates';

export function isExpense(t: Transaction): t is Expense {
  return t.type === 'expense';
}

export function sum(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

export function expensesInMonth(transactions: Transaction[], ref = new Date()): Expense[] {
  return transactions.filter((t): t is Expense => isExpense(t) && isThisMonth(t.date, ref));
}

export function incomesInMonth(transactions: Transaction[], ref = new Date()) {
  return transactions.filter((t) => t.type === 'income' && isThisMonth(t.date, ref));
}

export function expensesLastMonth(transactions: Transaction[], ref = new Date()): Expense[] {
  return transactions.filter((t): t is Expense => isExpense(t) && isLastMonth(t.date, ref));
}

export interface MonthSummary {
  income: number;
  expenses: number;
  saved: number;
  savingsRate: number; // 0-100
}

export function monthSummary(transactions: Transaction[], ref = new Date()): MonthSummary {
  const income = sum(incomesInMonth(transactions, ref).map((t) => t.amount));
  const expenses = sum(expensesInMonth(transactions, ref).map((t) => t.amount));
  const saved = income - expenses;
  const savingsRate = income > 0 ? Math.round((saved / income) * 100) : 0;
  return { income, expenses, saved, savingsRate };
}

export interface CategoryBreakdownItem {
  categoryId: string;
  name: string;
  icon: string;
  amount: number;
  percent: number;
}

export function categoryBreakdown(
  transactions: Transaction[],
  categories: Category[],
  ref = new Date()
): CategoryBreakdownItem[] {
  const expenses = expensesInMonth(transactions, ref);
  const total = sum(expenses.map((e) => e.amount));
  const byCategory = new Map<string, number>();
  for (const e of expenses) {
    byCategory.set(e.categoryId, (byCategory.get(e.categoryId) ?? 0) + e.amount);
  }
  const items: CategoryBreakdownItem[] = [];
  for (const [categoryId, amount] of byCategory.entries()) {
    const cat = categories.find((c) => c.id === categoryId);
    items.push({
      categoryId,
      name: cat?.name ?? 'Otros',
      icon: cat?.icon ?? '📦',
      amount,
      percent: total > 0 ? Math.round((amount / total) * 100) : 0,
    });
  }
  return items.sort((a, b) => b.amount - a.amount);
}

export function puedesGastar(disponible: number, gastosPrevistos: number, ahorroObjetivo: number): number {
  return disponible - gastosPrevistos - ahorroObjetivo;
}

export function projectedEndOfMonth(balance: number, transactions: Transaction[], ref = new Date()): number {
  const dayOfMonth = ref.getDate();
  const totalDays = totalDaysInMonth(ref);
  const { saved } = monthSummary(transactions, ref);
  const dailyRate = saved / dayOfMonth;
  const remainingDays = totalDays - dayOfMonth;
  return balance + dailyRate * remainingDays;
}

export function fixedExpensesTotals(items: { amount: number }[]) {
  const monthly = sum(items.map((i) => i.amount));
  return { monthly, annual: monthly * 12 };
}

export function goalProgress(goal: Goal) {
  const progress = goal.target > 0 ? Math.min(Math.round((goal.current / goal.target) * 100), 100) : 0;
  const remaining = Math.max(goal.target - goal.current, 0);
  let monthlyNeeded: number | null = null;
  if (goal.targetDate) {
    const now = new Date();
    const target = new Date(goal.targetDate);
    const months = Math.max(
      (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth()),
      1
    );
    monthlyNeeded = remaining / months;
  }
  return { progress, remaining, monthlyNeeded };
}

export function budgetStatus(budget: Budget, transactions: Transaction[], ref = new Date()) {
  const spent = sum(
    expensesInMonth(transactions, ref)
      .filter((e) => e.categoryId === budget.categoryId)
      .map((e) => e.amount)
  );
  const available = budget.monthlyLimit - spent;
  const percent = budget.monthlyLimit > 0 ? Math.round((spent / budget.monthlyLimit) * 100) : 0;
  return { spent, available, percent };
}

export function savingsMonthsNeeded(target: number, current: number, monthly: number): number | null {
  if (monthly <= 0) return null;
  const remaining = target - current;
  if (remaining <= 0) return 0;
  return remaining / monthly;
}

export function savingsMonthlyNeeded(target: number, current: number, months: number): number | null {
  if (months <= 0) return null;
  const remaining = target - current;
  if (remaining <= 0) return 0;
  return remaining / months;
}

export function dailySpendLimit(
  disponible: number,
  reservadoFijos: number,
  ahorroObjetivo: number,
  ref = new Date()
) {
  const realDisponible = Math.max(disponible - reservadoFijos - ahorroObjetivo, 0);
  const days = daysLeftInMonth(ref);
  return { realDisponible, days, perDay: realDisponible / days };
}

export function todaySpent(transactions: Transaction[], ref = new Date()): number {
  return sum(
    transactions.filter((t): t is Expense => isExpense(t) && isToday(t.date, ref)).map((t) => t.amount)
  );
}

export interface Insight {
  id: string;
  text: string;
  tone: 'positive' | 'warning' | 'neutral';
}

export function generateInsights(
  transactions: Transaction[],
  categories: Category[],
  budgets: Budget[],
  fixedTotal: number,
  ref = new Date()
): Insight[] {
  const insights: Insight[] = [];
  const thisMonth = monthSummary(transactions, ref);
  const thisMonthExpenses = expensesInMonth(transactions, ref);
  const lastMonthExpenses = expensesLastMonth(transactions, ref);
  const thisTotal = sum(thisMonthExpenses.map((e) => e.amount));
  const lastTotal = sum(lastMonthExpenses.map((e) => e.amount));

  if (lastTotal > 0) {
    const diff = lastTotal - thisTotal;
    if (diff > 0) {
      insights.push({
        id: 'less-than-last-month',
        text: `Has gastado ${diff.toFixed(0)} € menos que el mes pasado. ¡Bien hecho!`,
        tone: 'positive',
      });
    } else if (diff < 0) {
      insights.push({
        id: 'more-than-last-month',
        text: `Has gastado ${Math.abs(diff).toFixed(0)} € más que el mes pasado.`,
        tone: 'warning',
      });
    }
  }

  // Category comparisons
  const thisByCategory = new Map<string, number>();
  for (const e of thisMonthExpenses) thisByCategory.set(e.categoryId, (thisByCategory.get(e.categoryId) ?? 0) + e.amount);
  const lastByCategory = new Map<string, number>();
  for (const e of lastMonthExpenses) lastByCategory.set(e.categoryId, (lastByCategory.get(e.categoryId) ?? 0) + e.amount);

  for (const [categoryId, amount] of thisByCategory.entries()) {
    const lastAmount = lastByCategory.get(categoryId) ?? 0;
    const cat = categories.find((c) => c.id === categoryId);
    if (lastAmount > 0 && amount > lastAmount * 1.15) {
      const diff = amount - lastAmount;
      insights.push({
        id: `up-${categoryId}`,
        text: `Este mes has gastado ${diff.toFixed(0)} € más en ${cat?.name.toLowerCase() ?? 'esta categoría'} que el mes pasado.`,
        tone: 'warning',
      });
    }
  }

  if (thisTotal > 0) {
    const top = [...thisByCategory.entries()].sort((a, b) => b[1] - a[1])[0];
    if (top) {
      const cat = categories.find((c) => c.id === top[0]);
      const percent = Math.round((top[1] / thisTotal) * 100);
      if (percent >= 15) {
        insights.push({
          id: `percent-${top[0]}`,
          text: `${cat?.name ?? 'Esta categoría'} representa el ${percent}% de tus gastos este mes.`,
          tone: 'neutral',
        });
      }
    }
  }

  if (thisMonth.income > 0 && fixedTotal > 0) {
    const percent = Math.round((fixedTotal / thisMonth.income) * 100);
    insights.push({
      id: 'fixed-percent',
      text: `Tus gastos fijos representan el ${percent}% de tus ingresos.`,
      tone: percent > 50 ? 'warning' : 'neutral',
    });
  }

  if (thisMonth.saved > 0) {
    insights.push({
      id: 'saved-this-month',
      text: `Has conseguido ahorrar ${thisMonth.saved.toFixed(0)} € este mes. ¡Vas por buen camino!`,
      tone: 'positive',
    });
  } else if (thisMonth.income > 0 && thisMonth.saved < 0) {
    insights.push({
      id: 'overspent',
      text: `Este mes has gastado ${Math.abs(thisMonth.saved).toFixed(0)} € más de lo que has ingresado.`,
      tone: 'warning',
    });
  }

  // Budget warnings
  for (const b of budgets) {
    const { available, percent } = budgetStatus(b, transactions, ref);
    const cat = categories.find((c) => c.id === b.categoryId);
    if (percent >= 100) {
      insights.push({
        id: `budget-over-${b.categoryId}`,
        text: `Has superado tu presupuesto de ${cat?.name.toLowerCase() ?? 'esta categoría'}.`,
        tone: 'warning',
      });
    } else if (percent >= 80) {
      insights.push({
        id: `budget-near-${b.categoryId}`,
        text: `Te quedan ${available.toFixed(0)} € para ${cat?.name.toLowerCase() ?? 'esta categoría'} este mes.`,
        tone: 'warning',
      });
    }
  }

  return insights;
}

export interface MonthlyHistoryItem {
  key: string;
  label: string;
  income: number;
  expenses: number;
  saved: number;
}

export function monthlyHistory(transactions: Transaction[]): MonthlyHistoryItem[] {
  const map = new Map<string, { income: number; expenses: number }>();
  for (const t of transactions) {
    const key = format(parseISO(t.date), 'yyyy-MM');
    if (!map.has(key)) map.set(key, { income: 0, expenses: 0 });
    const entry = map.get(key)!;
    if (t.type === 'income') entry.income += t.amount;
    else entry.expenses += t.amount;
  }
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, { income, expenses }]) => {
      const [year, monthNum] = key.split('-');
      const monthName = MONTH_NAMES_ES[parseInt(monthNum, 10) - 1];
      return {
        key,
        label: `${monthName.slice(0, 3)} ${year.slice(2)}`,
        income,
        expenses,
        saved: income - expenses,
      };
    });
}
