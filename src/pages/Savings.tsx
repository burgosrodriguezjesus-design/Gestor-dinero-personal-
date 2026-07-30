import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';
import { Layout, PageHeader } from '../components/Layout';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { formatMoney } from '../lib/format';
import { goalProgress } from '../lib/calculations';

export function Savings() {
  const goals = useStore((s) => s.goals);
  const addToGoal = useStore((s) => s.addToGoal);
  const deleteGoal = useStore((s) => s.deleteGoal);
  const setSheet = useUIStore((s) => s.setSheet);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [amount, setAmount] = useState('');

  function handleAdd(id: string) {
    const n = parseFloat(amount);
    if (n > 0) addToGoal(id, n);
    setAddingTo(null);
    setAmount('');
  }

  return (
    <Layout>
      <PageHeader title="🎯 Mis objetivos" subtitle="Metas de ahorro que quieres conseguir" />

      <div className="grid grid-cols-2 gap-3 mb-5">
        <Link to="/mas/calculadora" className="py-3.5 rounded-2xl bg-black/[0.04] dark:bg-white/5 text-center text-sm font-semibold">
          🧮 Calculadora
        </Link>
        <Link to="/mas/plan" className="py-3.5 rounded-2xl bg-black/[0.04] dark:bg-white/5 text-center text-sm font-semibold">
          📅 Plan de mes
        </Link>
      </div>

      {goals.length === 0 ? (
        <Card className="text-center !py-10">
          <p className="text-3xl mb-2">🎯</p>
          <p className="text-sm text-ink/50 dark:text-white/50 mb-4">Todavía no tienes ningún objetivo.</p>
          <button onClick={() => setSheet('goal')} className="px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold">
            Crear objetivo
          </button>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {goals.map((goal) => {
            const stats = goalProgress(goal);
            return (
              <Card key={goal.id}>
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold">{goal.name}</p>
                  <button onClick={() => deleteGoal(goal.id)} className="text-ink/30 dark:text-white/30 text-sm">
                    Eliminar
                  </button>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-ink/50 dark:text-white/50">
                    Actual: <b className="text-ink dark:text-white">{formatMoney(goal.current)}</b>
                  </span>
                  <span className="text-ink/50 dark:text-white/50">
                    Objetivo: <b className="text-ink dark:text-white">{formatMoney(goal.target)}</b>
                  </span>
                </div>
                <ProgressBar percent={stats.progress} />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-ink/50 dark:text-white/50">
                    Progreso: {stats.progress}% · Faltan {formatMoney(stats.remaining)}
                  </p>
                </div>
                {stats.monthlyNeeded !== null && stats.remaining > 0 && (
                  <p className="text-xs text-brand font-medium mt-1">
                    Deberías ahorrar {formatMoney(stats.monthlyNeeded)}/mes para llegar a tiempo.
                  </p>
                )}

                {addingTo === goal.id ? (
                  <div className="flex gap-2 mt-3">
                    <input
                      autoFocus
                      type="number"
                      inputMode="decimal"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Cantidad"
                      className="flex-1 rounded-xl bg-black/[0.04] dark:bg-white/5 px-3 py-2 text-sm outline-none"
                      onKeyDown={(e) => e.key === 'Enter' && handleAdd(goal.id)}
                    />
                    <button onClick={() => handleAdd(goal.id)} className="px-4 rounded-xl bg-brand text-white text-sm font-semibold">
                      Añadir
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingTo(goal.id)}
                    className="w-full mt-3 py-2.5 rounded-xl bg-brand-light dark:bg-brand/15 text-brand text-sm font-semibold"
                  >
                    + Añadir ahorro
                  </button>
                )}
              </Card>
            );
          })}
          <button
            onClick={() => setSheet('goal')}
            className="py-3.5 rounded-2xl border-2 border-dashed border-black/15 dark:border-white/20 text-ink/50 dark:text-white/50 text-sm font-semibold"
          >
            + Nuevo objetivo
          </button>
        </div>
      )}
    </Layout>
  );
}
