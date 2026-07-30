import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Layout, PageHeader } from '../components/Layout';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { formatMoney } from '../lib/format';
import { budgetStatus } from '../lib/calculations';

export function Budgets() {
  const categories = useStore((s) => s.categories);
  const budgets = useStore((s) => s.budgets);
  const transactions = useStore((s) => s.transactions);
  const setBudget = useStore((s) => s.setBudget);

  const [editing, setEditing] = useState<string | null>(null);
  const [value, setValue] = useState('');

  function startEdit(categoryId: string, current: number) {
    setEditing(categoryId);
    setValue(current > 0 ? String(current) : '');
  }

  function save(categoryId: string) {
    setBudget(categoryId, parseFloat(value) || 0);
    setEditing(null);
  }

  return (
    <Layout>
      <PageHeader title="📋 Presupuestos" subtitle="Establece cuánto quieres gastar como máximo en cada categoría" />
      <div className="flex flex-col gap-3">
        {categories.map((cat) => {
          const budget = budgets.find((b) => b.categoryId === cat.id);
          const limit = budget?.monthlyLimit ?? 0;
          const status = budget ? budgetStatus(budget, transactions) : null;

          return (
            <Card key={cat.id}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{cat.icon}</span>
                <span className="font-semibold flex-1">{cat.name}</span>
                {editing === cat.id ? (
                  <div className="flex gap-1.5 items-center">
                    <input
                      autoFocus
                      type="number"
                      inputMode="decimal"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="w-20 rounded-lg bg-black/[0.05] dark:bg-white/10 px-2 py-1.5 text-sm outline-none"
                      onKeyDown={(e) => e.key === 'Enter' && save(cat.id)}
                    />
                    <button onClick={() => save(cat.id)} className="text-brand text-sm font-semibold">
                      OK
                    </button>
                  </div>
                ) : (
                  <button onClick={() => startEdit(cat.id, limit)} className="text-brand text-sm font-semibold">
                    {limit > 0 ? 'Editar' : '+ Definir'}
                  </button>
                )}
              </div>

              {budget && limit > 0 && status && (
                <>
                  <ProgressBar percent={status.percent} color={status.percent >= 100 ? 'rose' : status.percent >= 80 ? 'amber' : 'brand'} />
                  <div className="flex justify-between text-xs mt-2 text-ink/50 dark:text-white/50">
                    <span>Gastado: {formatMoney(status.spent)}</span>
                    <span className={status.available < 0 ? 'text-rose font-semibold' : ''}>
                      Disponible: {formatMoney(status.available)}
                    </span>
                  </div>
                  {status.percent >= 100 ? (
                    <p className="text-xs text-rose font-semibold mt-2">🔴 Has superado tu presupuesto de {cat.name.toLowerCase()}.</p>
                  ) : status.percent >= 80 ? (
                    <p className="text-xs text-amber font-semibold mt-2">⚠️ Te quedan {formatMoney(status.available)} para {cat.name.toLowerCase()} este mes.</p>
                  ) : null}
                </>
              )}
            </Card>
          );
        })}
      </div>
    </Layout>
  );
}
