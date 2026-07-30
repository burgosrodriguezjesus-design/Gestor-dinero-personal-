import { useMemo } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { useStore } from '../store/useStore';
import { Layout, PageHeader } from '../components/Layout';
import { Card, SectionTitle } from '../components/Card';
import { formatMoney } from '../lib/format';
import { monthlyHistory, monthSummary, sum, categoryBreakdown, expensesLastMonth } from '../lib/calculations';
import { monthLabel, subMonths } from '../lib/dates';

export function Evolution() {
  const transactions = useStore((s) => s.transactions);
  const categories = useStore((s) => s.categories);

  const history = useMemo(() => monthlyHistory(transactions), [transactions]);
  const accumulated = useMemo(() => sum(history.map((h) => h.saved)), [history]);

  const currentSummary = useMemo(() => monthSummary(transactions), [transactions]);
  const lastSummary = useMemo(() => monthSummary(transactions, subMonths(new Date(), 1)), [transactions]);
  const breakdown = useMemo(() => categoryBreakdown(transactions, categories), [transactions, categories]);
  const topCategory = breakdown[0];
  const lastExpensesTotal = sum(expensesLastMonth(transactions).map((e) => e.amount));
  const diffVsLast = lastExpensesTotal - currentSummary.expenses;

  return (
    <Layout>
      <PageHeader title="📈 Mi evolución" subtitle="Cuánto dinero has conseguido ahorrar cada mes" />

      {history.length === 0 ? (
        <p className="text-center text-sm text-ink/40 dark:text-white/40 mt-10">
          Registra ingresos y gastos para ver tu evolución mes a mes.
        </p>
      ) : (
        <>
          <Card className="mb-5">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={history}>
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v) => formatMoney(Number(v))} />
                  <Bar dataKey="saved" radius={[6, 6, 0, 0]}>
                    {history.map((h, i) => (
                      <Cell key={i} fill={h.saved >= 0 ? '#2f6f4e' : '#c23b3b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="mb-5 flex items-center justify-between">
            <span className="text-sm text-ink/50 dark:text-white/50">Ahorro acumulado</span>
            <span className={`text-2xl font-extrabold ${accumulated >= 0 ? 'text-brand' : 'text-rose'}`}>
              {formatMoney(accumulated)}
            </span>
          </Card>

          <div className="flex flex-col gap-2 mb-5">
            {[...history].reverse().map((h) => (
              <div key={h.key} className="flex items-center justify-between bg-card dark:bg-card-dark rounded-2xl px-4 py-3">
                <span className="text-sm font-medium capitalize">{h.label}</span>
                <span className={`font-semibold text-sm ${h.saved >= 0 ? 'text-brand' : 'text-rose'}`}>
                  {h.saved >= 0 ? '+' : ''}{formatMoney(h.saved)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <SectionTitle emoji="🗓️">Tu resumen de {monthLabel()}</SectionTitle>
      <Card>
        <Row label="Ingresos" value={formatMoney(currentSummary.income)} />
        <Row label="Gastos" value={formatMoney(currentSummary.expenses)} />
        <Row label="Ahorrado" value={formatMoney(currentSummary.saved)} />
        <Row label="Tasa de ahorro" value={`${currentSummary.savingsRate}%`} />
        {topCategory && <Row label="Categoría donde más gastaste" value={`${topCategory.icon} ${topCategory.name}`} />}
        {lastSummary.expenses > 0 && (
          <p className="text-sm text-ink/60 dark:text-white/60 mt-3">
            Comparado con el mes anterior: {diffVsLast >= 0
              ? `has gastado ${formatMoney(diffVsLast)} menos.`
              : `has gastado ${formatMoney(Math.abs(diffVsLast))} más.`}
          </p>
        )}
      </Card>
    </Layout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm py-1.5">
      <span className="text-ink/60 dark:text-white/60">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
