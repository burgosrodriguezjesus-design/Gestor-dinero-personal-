import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Layout, PageHeader } from '../components/Layout';
import { Card } from '../components/Card';
import { formatMoney } from '../lib/format';
import { fixedExpensesTotals } from '../lib/calculations';

export function Subscriptions() {
  const subscriptions = useStore((s) => s.subscriptions);
  const addSubscription = useStore((s) => s.addSubscription);
  const removeSubscription = useStore((s) => s.removeSubscription);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const totals = fixedExpensesTotals(subscriptions);

  function handleAdd() {
    if (!name.trim() || !(parseFloat(amount) > 0)) return;
    addSubscription({ name: name.trim(), amount: parseFloat(amount) });
    setName('');
    setAmount('');
  }

  return (
    <Layout>
      <PageHeader title="📺 Suscripciones" subtitle="Registra tus suscripciones manualmente" />

      <Card className="mb-5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-ink/50 dark:text-white/50 mb-0.5">Al mes</p>
          <p className="text-xl font-bold">{formatMoney(totals.monthly)}</p>
        </div>
        <div>
          <p className="text-xs text-ink/50 dark:text-white/50 mb-0.5">Al año</p>
          <p className="text-xl font-bold">{formatMoney(totals.annual)}</p>
        </div>
      </Card>

      <div className="flex flex-col gap-2 mb-4">
        {subscriptions.map((s) => (
          <Card key={s.id} className="!py-3.5 flex items-center gap-3">
            <span className="text-lg">{s.icon}</span>
            <span className="flex-1 font-medium text-sm">{s.name}</span>
            <span className="font-semibold text-sm">{formatMoney(s.amount)}</span>
            <button onClick={() => removeSubscription(s.id)} className="text-ink/30 dark:text-white/30 text-sm ml-1">
              ✕
            </button>
          </Card>
        ))}
        {subscriptions.length === 0 && (
          <p className="text-center text-sm text-ink/40 dark:text-white/40 py-6">Aún no has añadido ninguna suscripción.</p>
        )}
      </div>

      <Card>
        <p className="text-sm font-medium mb-2">Añadir suscripción</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Netflix"
          className="w-full rounded-xl bg-black/[0.04] dark:bg-white/5 px-4 py-3 text-sm outline-none mb-2"
        />
        <input
          type="number"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Importe mensual"
          className="w-full rounded-xl bg-black/[0.04] dark:bg-white/5 px-4 py-3 text-sm outline-none mb-3"
        />
        <button onClick={handleAdd} className="w-full py-3 rounded-xl bg-brand text-white font-semibold text-sm">
          Añadir
        </button>
      </Card>
    </Layout>
  );
}
