import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useStore } from '../store/useStore';
import { Layout, PageHeader } from '../components/Layout';
import { Card, SectionTitle } from '../components/Card';
import { formatMoney } from '../lib/format';
import { categoryBreakdown, generateInsights, fixedExpensesTotals } from '../lib/calculations';

const COLORS = ['#2f6f4e', '#4caf7d', '#b8860b', '#c23b3b', '#5b7fb5', '#8a6fb8', '#c77d3e', '#4a9d9c', '#9a5b7a', '#7d8a4a'];

export function Analysis() {
  const transactions = useStore((s) => s.transactions);
  const categories = useStore((s) => s.categories);
  const budgets = useStore((s) => s.budgets);
  const fixedExpenses = useStore((s) => s.fixedExpenses);

  const breakdown = useMemo(() => categoryBreakdown(transactions, categories), [transactions, categories]);
  const fixedTotal = fixedExpensesTotals(fixedExpenses).monthly;
  const insights = useMemo(
    () => generateInsights(transactions, categories, budgets, fixedTotal),
    [transactions, categories, budgets, fixedTotal]
  );

  const total = breakdown.reduce((a, b) => a + b.amount, 0);

  return (
    <Layout>
      <PageHeader title="¿Dónde se me va el dinero?" subtitle="Análisis de tus gastos de este mes" />

      {breakdown.length === 0 ? (
        <p className="text-center text-ink/40 dark:text-white/40 text-sm mt-10">
          Aún no has registrado gastos este mes.
        </p>
      ) : (
        <>
          <Card className="mb-5">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdown}
                    dataKey="amount"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {breakdown.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatMoney(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-sm text-ink/50 dark:text-white/50 -mt-2">
              Total gastado: <b className="text-ink dark:text-white">{formatMoney(total)}</b>
            </p>
          </Card>

          <SectionTitle>Por categoría</SectionTitle>
          <div className="flex flex-col gap-2 mb-5">
            {breakdown.map((item, i) => (
              <Card key={item.categoryId} className="!py-3.5 flex items-center gap-3">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-lg">{item.icon}</span>
                <span className="flex-1 text-sm font-medium">{item.name}</span>
                <span className="text-xs text-ink/40 dark:text-white/40">{item.percent}%</span>
                <span className="font-semibold text-sm w-20 text-right">{formatMoney(item.amount)}</span>
              </Card>
            ))}
          </div>
        </>
      )}

      {insights.length > 0 && (
        <>
          <SectionTitle emoji="💡">Consejos inteligentes</SectionTitle>
          <div className="flex flex-col gap-2">
            {insights.map((insight) => (
              <Card key={insight.id} className="!p-4">
                <p className="text-sm">{insight.text}</p>
              </Card>
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}
