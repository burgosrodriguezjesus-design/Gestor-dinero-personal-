import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Layout, PageHeader } from '../components/Layout';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { formatMoney } from '../lib/format';

export function Debts() {
  const debts = useStore((s) => s.debts);
  const addDebt = useStore((s) => s.addDebt);
  const removeDebt = useStore((s) => s.removeDebt);
  const payDebt = useStore((s) => s.payDebt);

  const [name, setName] = useState('');
  const [total, setTotal] = useState('');
  const [paid, setPaid] = useState('');
  const [payingId, setPayingId] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState('');

  function handleAdd() {
    if (!name.trim() || !(parseFloat(total) > 0)) return;
    addDebt({ name: name.trim(), totalAmount: parseFloat(total), paidAmount: parseFloat(paid) || 0 });
    setName('');
    setTotal('');
    setPaid('');
  }

  function handlePay(id: string) {
    const n = parseFloat(payAmount);
    if (n > 0) payDebt(id, n);
    setPayingId(null);
    setPayAmount('');
  }

  return (
    <Layout>
      <PageHeader title="💳 Deudas" subtitle="Control manual de lo que debes, sin conexión bancaria" />

      <div className="flex flex-col gap-3 mb-5">
        {debts.map((d) => {
          const remaining = d.totalAmount - d.paidAmount;
          const percent = d.totalAmount > 0 ? Math.min(Math.round((d.paidAmount / d.totalAmount) * 100), 100) : 0;
          return (
            <Card key={d.id}>
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold">{d.name}</p>
                <button onClick={() => removeDebt(d.id)} className="text-ink/30 dark:text-white/30 text-sm">
                  Eliminar
                </button>
              </div>
              <div className="grid grid-cols-3 text-sm mb-2">
                <div>
                  <p className="text-xs text-ink/50 dark:text-white/50">Deuda</p>
                  <p className="font-semibold">{formatMoney(d.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-ink/50 dark:text-white/50">Pagado</p>
                  <p className="font-semibold text-brand">{formatMoney(d.paidAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-ink/50 dark:text-white/50">Quedan</p>
                  <p className="font-semibold text-rose">{formatMoney(remaining)}</p>
                </div>
              </div>
              <ProgressBar percent={percent} />
              <p className="text-right text-xs text-ink/50 dark:text-white/50 mt-1">{percent}% pagado</p>

              {remaining > 0 ? (
                payingId === d.id ? (
                  <div className="flex gap-2 mt-3">
                    <input
                      autoFocus
                      type="number"
                      inputMode="decimal"
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      placeholder="Cantidad"
                      className="flex-1 rounded-xl bg-black/[0.04] dark:bg-white/5 px-3 py-2 text-sm outline-none"
                      onKeyDown={(e) => e.key === 'Enter' && handlePay(d.id)}
                    />
                    <button onClick={() => handlePay(d.id)} className="px-4 rounded-xl bg-brand text-white text-sm font-semibold">
                      Pagar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setPayingId(d.id)}
                    className="w-full mt-3 py-2.5 rounded-xl bg-brand-light dark:bg-brand/15 text-brand text-sm font-semibold"
                  >
                    Registrar pago
                  </button>
                )
              ) : (
                <p className="text-center text-sm text-brand font-semibold mt-3">🎉 Deuda saldada</p>
              )}
            </Card>
          );
        })}
        {debts.length === 0 && (
          <p className="text-center text-sm text-ink/40 dark:text-white/40 py-6">No tienes deudas registradas.</p>
        )}
      </div>

      <Card>
        <p className="text-sm font-medium mb-2">Añadir deuda</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Préstamo moto"
          className="w-full rounded-xl bg-black/[0.04] dark:bg-white/5 px-4 py-3 text-sm outline-none mb-2"
        />
        <input
          type="number"
          inputMode="decimal"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          placeholder="Cantidad total"
          className="w-full rounded-xl bg-black/[0.04] dark:bg-white/5 px-4 py-3 text-sm outline-none mb-2"
        />
        <input
          type="number"
          inputMode="decimal"
          value={paid}
          onChange={(e) => setPaid(e.target.value)}
          placeholder="Ya pagado (opcional)"
          className="w-full rounded-xl bg-black/[0.04] dark:bg-white/5 px-4 py-3 text-sm outline-none mb-3"
        />
        <button onClick={handleAdd} className="w-full py-3 rounded-xl bg-brand text-white font-semibold text-sm">
          Añadir
        </button>
      </Card>
    </Layout>
  );
}
