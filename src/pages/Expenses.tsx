import { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';
import { Layout, PageHeader } from '../components/Layout';
import { Card } from '../components/Card';
import { formatMoney } from '../lib/format';
import { friendlyDateGroup, isThisMonth, isThisWeek, isToday, parseISO, startOfMonth, subMonths, endOfMonth } from '../lib/dates';
import type { Expense } from '../types';
import { sum } from '../lib/calculations';

type Filter = 'hoy' | 'semana' | 'mes' | 'anterior' | 'todo';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'hoy', label: 'Hoy' },
  { key: 'semana', label: 'Esta semana' },
  { key: 'mes', label: 'Este mes' },
  { key: 'anterior', label: 'Mes anterior' },
  { key: 'todo', label: 'Todo' },
];

export function Expenses() {
  const transactions = useStore((s) => s.transactions);
  const categories = useStore((s) => s.categories);
  const editExpense = useUIStore((s) => s.editExpense);
  const [filter, setFilter] = useState<Filter>('mes');

  const expenses = useMemo(() => {
    const all = transactions.filter((t): t is Expense => t.type === 'expense');
    switch (filter) {
      case 'hoy':
        return all.filter((e) => isToday(e.date));
      case 'semana':
        return all.filter((e) => isThisWeek(e.date));
      case 'mes':
        return all.filter((e) => isThisMonth(e.date));
      case 'anterior': {
        const last = subMonths(new Date(), 1);
        return all.filter((e) => {
          const d = parseISO(e.date);
          return d >= startOfMonth(last) && d <= endOfMonth(last);
        });
      }
      default:
        return all;
    }
  }, [transactions, filter]);

  const total = sum(expenses.map((e) => e.amount));

  const groups = useMemo(() => {
    const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
    const map = new Map<string, Expense[]>();
    for (const e of sorted) {
      const label = friendlyDateGroup(e.date);
      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(e);
    }
    return [...map.entries()];
  }, [expenses]);

  const monthTotal = useMemo(
    () => sum(transactions.filter((t): t is Expense => t.type === 'expense' && isThisMonth(t.date)).map((e) => e.amount)),
    [transactions]
  );

  return (
    <Layout>
      <PageHeader title="Mis gastos" subtitle={`Total gastado este mes: ${formatMoney(monthTotal)}`} />

      <div className="flex gap-2 overflow-x-auto mb-5 -mx-4 px-4 pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium ${
              filter === f.key ? 'bg-brand text-white' : 'bg-black/[0.05] dark:bg-white/10 text-ink/60 dark:text-white/60'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Card className="mb-5 flex items-center justify-between !py-4">
        <span className="text-sm text-ink/50 dark:text-white/50">Total del periodo</span>
        <span className="text-xl font-bold text-rose">-{formatMoney(total)}</span>
      </Card>

      {groups.length === 0 ? (
        <p className="text-center text-ink/40 dark:text-white/40 text-sm mt-10">No hay gastos en este periodo.</p>
      ) : (
        <div className="flex flex-col gap-5">
          {groups.map(([label, items]) => (
            <div key={label}>
              <p className="text-xs font-semibold text-ink/40 dark:text-white/40 uppercase tracking-wide mb-2">{label}</p>
              <div className="flex flex-col gap-2">
                {items.map((e) => {
                  const cat = categories.find((c) => c.id === e.categoryId);
                  return (
                    <button
                      key={e.id}
                      onClick={() => editExpense(e.id)}
                      className="flex items-center gap-3 bg-card dark:bg-card-dark rounded-2xl p-3.5 text-left active:scale-[0.98] transition-transform"
                    >
                      <span className="text-xl w-9 h-9 flex items-center justify-center rounded-full bg-black/[0.04] dark:bg-white/10 shrink-0">
                        {cat?.icon ?? '📦'}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-medium truncate">{e.concept || cat?.name || 'Gasto'}</span>
                        <span className="block text-xs text-ink/40 dark:text-white/40">{cat?.name}</span>
                      </span>
                      <span className="font-semibold text-rose shrink-0">-{formatMoney(e.amount)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
