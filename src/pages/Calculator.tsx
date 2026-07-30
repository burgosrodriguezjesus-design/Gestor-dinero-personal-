import { useState } from 'react';
import { Layout, PageHeader } from '../components/Layout';
import { Card } from '../components/Card';
import { formatMoney, formatNumber } from '../lib/format';
import { savingsMonthsNeeded, savingsMonthlyNeeded } from '../lib/calculations';

type Mode = 'time' | 'monthly';

export function Calculator() {
  const [mode, setMode] = useState<Mode>('time');

  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [monthly, setMonthly] = useState('');
  const [months, setMonths] = useState('');

  const targetN = parseFloat(target) || 0;
  const currentN = parseFloat(current) || 0;
  const monthlyN = parseFloat(monthly) || 0;
  const monthsN = parseFloat(months) || 0;

  const monthsNeeded = mode === 'time' ? savingsMonthsNeeded(targetN, currentN, monthlyN) : null;
  const monthlyNeeded = mode === 'monthly' ? savingsMonthlyNeeded(targetN, currentN, monthsN) : null;

  return (
    <Layout>
      <PageHeader title="🧮 Calculadora de ahorro" subtitle="¿Cuánto tardaré en conseguirlo?" />

      <div className="grid grid-cols-2 gap-2 mb-5">
        <button
          onClick={() => setMode('time')}
          className={`py-3 rounded-2xl text-sm font-semibold ${mode === 'time' ? 'bg-brand text-white' : 'bg-black/[0.05] dark:bg-white/10 text-ink/60 dark:text-white/60'}`}
        >
          Tiempo necesario
        </button>
        <button
          onClick={() => setMode('monthly')}
          className={`py-3 rounded-2xl text-sm font-semibold ${mode === 'monthly' ? 'bg-brand text-white' : 'bg-black/[0.05] dark:bg-white/10 text-ink/60 dark:text-white/60'}`}
        >
          Ahorro mensual
        </button>
      </div>

      <Card className="mb-5">
        <label className="block text-sm font-medium mb-2">
          Objetivo
          <input
            type="number"
            inputMode="decimal"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="5000"
            className="w-full mt-1 rounded-xl bg-black/[0.04] dark:bg-white/5 px-4 py-3 text-sm outline-none font-normal"
          />
        </label>
        <label className="block text-sm font-medium mb-2">
          Ya tengo
          <input
            type="number"
            inputMode="decimal"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="1500"
            className="w-full mt-1 rounded-xl bg-black/[0.04] dark:bg-white/5 px-4 py-3 text-sm outline-none font-normal"
          />
        </label>

        {mode === 'time' ? (
          <label className="block text-sm font-medium mb-1">
            Puedo ahorrar (al mes)
            <input
              type="number"
              inputMode="decimal"
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
              placeholder="300"
              className="w-full mt-1 rounded-xl bg-black/[0.04] dark:bg-white/5 px-4 py-3 text-sm outline-none font-normal"
            />
          </label>
        ) : (
          <label className="block text-sm font-medium mb-1">
            Quiero conseguirlo en (meses)
            <input
              type="number"
              inputMode="decimal"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              placeholder="10"
              className="w-full mt-1 rounded-xl bg-black/[0.04] dark:bg-white/5 px-4 py-3 text-sm outline-none font-normal"
            />
          </label>
        )}
      </Card>

      <Card className="!bg-brand-light dark:!bg-brand/15 text-center">
        {mode === 'time' ? (
          monthsNeeded === null ? (
            <p className="text-sm text-ink/50 dark:text-white/50">Indica cuánto puedes ahorrar al mes.</p>
          ) : monthsNeeded === 0 ? (
            <p className="text-lg font-bold text-brand">¡Ya has alcanzado tu objetivo! 🎉</p>
          ) : (
            <p className="text-brand">
              Te faltan <span className="text-3xl font-extrabold block my-1">{formatNumber(monthsNeeded, 1)} meses</span>
              aproximadamente
            </p>
          )
        ) : monthlyNeeded === null ? (
          <p className="text-sm text-ink/50 dark:text-white/50">Indica en cuántos meses quieres conseguirlo.</p>
        ) : monthlyNeeded === 0 ? (
          <p className="text-lg font-bold text-brand">¡Ya has alcanzado tu objetivo! 🎉</p>
        ) : (
          <p className="text-brand">
            Necesitas ahorrar
            <span className="text-3xl font-extrabold block my-1">{formatMoney(monthlyNeeded)}/mes</span>
          </p>
        )}
      </Card>
    </Layout>
  );
}
