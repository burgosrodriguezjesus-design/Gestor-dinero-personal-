import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Layout, PageHeader } from '../components/Layout';
import { Card, SectionTitle } from '../components/Card';
import { formatMoney } from '../lib/format';
import { fixedExpensesTotals } from '../lib/calculations';

export function Plan() {
  const monthPlan = useStore((s) => s.monthPlan);
  const setMonthPlan = useStore((s) => s.setMonthPlan);
  const fixedExpenses = useStore((s) => s.fixedExpenses);

  const [expectedIncome, setExpectedIncome] = useState(monthPlan.expectedIncome);
  const [variableExpensesEstimate, setVariableExpensesEstimate] = useState(monthPlan.variableExpensesEstimate);
  const [savingsGoal, setSavingsGoal] = useState(monthPlan.savingsGoal);

  const fixedTotal = fixedExpensesTotals(fixedExpenses).monthly;
  const plannedExpenses = fixedTotal + variableExpensesEstimate;
  const free = expectedIncome - plannedExpenses - savingsGoal;

  function save() {
    setMonthPlan({ expectedIncome, variableExpensesEstimate, savingsGoal });
  }

  return (
    <Layout>
      <PageHeader title="📅 Plan de mes" subtitle="Planifica tu mes antes de empezar" />

      <Card className="mb-5">
        <label className="block text-sm font-medium mb-2">
          Ingresos previstos
          <input
            type="number"
            inputMode="decimal"
            value={expectedIncome || ''}
            onChange={(e) => setExpectedIncome(parseFloat(e.target.value) || 0)}
            placeholder="0"
            className="w-full mt-1 rounded-xl bg-black/[0.04] dark:bg-white/5 px-4 py-3 text-sm outline-none font-normal"
          />
        </label>

        <div className="flex items-center justify-between text-sm mb-2 mt-3 bg-black/[0.03] dark:bg-white/5 rounded-xl px-4 py-3">
          <span className="text-ink/60 dark:text-white/60">Gastos fijos (automático)</span>
          <span className="font-semibold">{formatMoney(fixedTotal)}</span>
        </div>

        <label className="block text-sm font-medium mb-2">
          Gastos variables estimados <span className="text-ink/40 font-normal">(comida, gasolina, ocio...)</span>
          <input
            type="number"
            inputMode="decimal"
            value={variableExpensesEstimate || ''}
            onChange={(e) => setVariableExpensesEstimate(parseFloat(e.target.value) || 0)}
            placeholder="0"
            className="w-full mt-1 rounded-xl bg-black/[0.04] dark:bg-white/5 px-4 py-3 text-sm outline-none font-normal"
          />
        </label>

        <label className="block text-sm font-medium mb-2">
          Objetivo de ahorro
          <input
            type="number"
            inputMode="decimal"
            value={savingsGoal || ''}
            onChange={(e) => setSavingsGoal(parseFloat(e.target.value) || 0)}
            placeholder="0"
            className="w-full mt-1 rounded-xl bg-black/[0.04] dark:bg-white/5 px-4 py-3 text-sm outline-none font-normal"
          />
        </label>

        <button onClick={save} className="w-full py-3 rounded-xl bg-brand text-white font-semibold text-sm mt-1">
          Guardar plan
        </button>
      </Card>

      <SectionTitle>Resumen</SectionTitle>
      <Card>
        <Row label="Ingresos" value={expectedIncome} />
        <Row label="Gastos previstos" value={-plannedExpenses} />
        <Row label="Ahorro" value={-savingsGoal} />
        <div className="border-t border-black/5 dark:border-white/10 my-2" />
        <div className="flex justify-between items-center">
          <span className="font-semibold">Dinero libre</span>
          <span className={`text-2xl font-extrabold ${free >= 0 ? 'text-brand' : 'text-rose'}`}>{formatMoney(free)}</span>
        </div>
      </Card>
    </Layout>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-sm py-1.5">
      <span className="text-ink/60 dark:text-white/60">{label}</span>
      <span className="font-semibold">{formatMoney(value)}</span>
    </div>
  );
}
