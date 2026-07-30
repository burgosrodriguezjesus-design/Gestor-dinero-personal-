import { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';
import { Layout } from '../components/Layout';
import { Card, SectionTitle } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { formatMoney, formatMoneySigned } from '../lib/format';
import {
  monthSummary,
  puedesGastar,
  goalProgress,
  dailySpendLimit,
  todaySpent,
  generateInsights,
  fixedExpensesTotals,
} from '../lib/calculations';
import { monthLabel } from '../lib/dates';
import { Link } from 'react-router-dom';

export function Home() {
  const balance = useStore((s) => s.balance);
  const transactions = useStore((s) => s.transactions);
  const goals = useStore((s) => s.goals);
  const settings = useStore((s) => s.settings);
  const setSettings = useStore((s) => s.setSettings);
  const budgets = useStore((s) => s.budgets);
  const categories = useStore((s) => s.categories);
  const fixedExpenses = useStore((s) => s.fixedExpenses);
  const setSheet = useUIStore((s) => s.setSheet);

  const summary = useMemo(() => monthSummary(transactions), [transactions]);
  const mainGoal = goals[0];
  const mainGoalStats = mainGoal ? goalProgress(mainGoal) : null;

  const [plannedExpenses, setPlannedExpenses] = useState(settings.plannedMonthlyExpenses);
  const [savingsGoal, setSavingsGoal] = useState(settings.monthlySavingsGoal);
  const [editingPlan, setEditingPlan] = useState(false);

  const canSpend = puedesGastar(balance, plannedExpenses, savingsGoal);

  const fixedTotal = fixedExpensesTotals(fixedExpenses).monthly;
  const insights = useMemo(
    () => generateInsights(transactions, categories, budgets, fixedTotal),
    [transactions, categories, budgets, fixedTotal]
  );

  const daily = dailySpendLimit(balance, fixedTotal, savingsGoal);
  const spentToday = todaySpent(transactions);

  function savePlan() {
    setSettings({ plannedMonthlyExpenses: plannedExpenses, monthlySavingsGoal: savingsGoal });
    setEditingPlan(false);
  }

  return (
    <Layout>
      <header className="mb-6">
        <p className="text-sm text-ink/50 dark:text-white/50 capitalize">{monthLabel()}</p>
        <p className="text-xs uppercase tracking-wide text-ink/40 dark:text-white/40 mt-3 font-semibold">
          💰 Dinero disponible
        </p>
        <p className="text-5xl font-extrabold mt-1 tracking-tight">{formatMoney(balance)}</p>
      </header>

      <SectionTitle>Este mes</SectionTitle>
      <Card className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <Stat label="Ingresos" value={summary.income} tone="positive" />
          <Stat label="Gastos" value={-summary.expenses} tone="negative" />
          <Stat label="Ahorrado" value={summary.saved} tone={summary.saved >= 0 ? 'positive' : 'negative'} />
          <div>
            <p className="text-xs text-ink/50 dark:text-white/50 mb-0.5">Tasa de ahorro</p>
            <p className="text-xl font-bold">{summary.savingsRate}%</p>
          </div>
        </div>
      </Card>

      <Link to="/mas/calculadora" className="block">
        <Card className="mb-4 !bg-brand-light dark:!bg-brand/15">
          <p className="text-xs uppercase tracking-wide text-brand font-semibold mb-1">💸 Puedes gastar</p>
          <p className="text-4xl font-extrabold text-brand mb-3">{formatMoney(Math.max(canSpend, 0))}</p>
          {!editingPlan ? (
            <div className="flex items-center justify-between text-xs text-ink/60 dark:text-white/60">
              <span>
                Gastos previstos {formatMoney(plannedExpenses)} · Ahorro objetivo {formatMoney(savingsGoal)}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setEditingPlan(true);
                }}
                className="text-brand font-semibold shrink-0 ml-2"
              >
                Editar
              </button>
            </div>
          ) : (
            <div onClick={(e) => e.preventDefault()} className="space-y-2 animate-fade-in">
              <label className="block text-xs text-ink/60 dark:text-white/60">
                Gastos previstos
                <input
                  type="number"
                  value={plannedExpenses}
                  onChange={(e) => setPlannedExpenses(parseFloat(e.target.value) || 0)}
                  className="w-full mt-1 rounded-lg bg-white/70 dark:bg-black/20 px-3 py-2 text-sm outline-none"
                />
              </label>
              <label className="block text-xs text-ink/60 dark:text-white/60">
                Ahorro objetivo
                <input
                  type="number"
                  value={savingsGoal}
                  onChange={(e) => setSavingsGoal(parseFloat(e.target.value) || 0)}
                  className="w-full mt-1 rounded-lg bg-white/70 dark:bg-black/20 px-3 py-2 text-sm outline-none"
                />
              </label>
              <button
                onClick={savePlan}
                className="w-full py-2 rounded-lg bg-brand text-white text-sm font-semibold"
              >
                Guardar
              </button>
            </div>
          )}
        </Card>
      </Link>

      {settings.noOverspendMode && (
        <Card className="mb-4">
          <p className="text-xs uppercase tracking-wide text-ink/50 dark:text-white/50 font-semibold mb-1">
            🚦 No me puedo pasar
          </p>
          <p className="text-3xl font-extrabold mb-1">{formatMoney(daily.perDay)}<span className="text-sm font-medium text-ink/50"> /día</span></p>
          <p className="text-xs text-ink/50 dark:text-white/50">
            Quedan {daily.days} días del mes · Hoy has gastado {formatMoney(spentToday)}
            {spentToday > daily.perDay && (
              <span className="text-rose font-semibold"> (+{formatMoney(spentToday - daily.perDay)} sobre tu límite)</span>
            )}
          </p>
        </Card>
      )}

      {mainGoal && mainGoalStats && (
        <>
          <SectionTitle emoji="🎯">Mi objetivo</SectionTitle>
          <Link to="/ahorro">
            <Card className="mb-4">
              <p className="font-semibold mb-2">{mainGoal.name}</p>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-ink/50 dark:text-white/50">Actual: <b className="text-ink dark:text-white">{formatMoney(mainGoal.current)}</b></span>
                <span className="text-ink/50 dark:text-white/50">Objetivo: <b className="text-ink dark:text-white">{formatMoney(mainGoal.target)}</b></span>
              </div>
              <ProgressBar percent={mainGoalStats.progress} />
              <p className="text-right text-xs text-ink/50 dark:text-white/50 mt-1">{mainGoalStats.progress}%</p>
            </Card>
          </Link>
        </>
      )}

      {insights.length > 0 && (
        <>
          <SectionTitle emoji="💡">Consejos</SectionTitle>
          <div className="flex flex-col gap-2 mb-4">
            {insights.slice(0, 3).map((insight) => (
              <Card key={insight.id} className="!p-4">
                <p className="text-sm">{insight.text}</p>
              </Card>
            ))}
          </div>
        </>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button onClick={() => setSheet('expense')} className="py-4 rounded-2xl bg-rose-light dark:bg-rose/15 text-rose font-semibold text-sm active:scale-[0.98] transition-transform">
          + Añadir gasto
        </button>
        <button onClick={() => setSheet('income')} className="py-4 rounded-2xl bg-brand-light dark:bg-brand/15 text-brand font-semibold text-sm active:scale-[0.98] transition-transform">
          + Añadir ingreso
        </button>
      </div>
    </Layout>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: 'positive' | 'negative' }) {
  return (
    <div>
      <p className="text-xs text-ink/50 dark:text-white/50 mb-0.5">{label}</p>
      <p className={`text-xl font-bold ${tone === 'positive' ? 'text-brand' : 'text-rose'}`}>
        {formatMoneySigned(value)}
      </p>
    </div>
  );
}
