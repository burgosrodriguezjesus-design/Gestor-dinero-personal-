import { useEffect, useState } from 'react';
import { Sheet } from './Sheet';
import { AmountInput } from './AmountInput';
import { useStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';

const SUGGESTIONS = ['Nómina', 'Venta', 'Trabajo extra', 'Regalo'];

export function AddIncomeSheet() {
  const openSheet = useUIStore((s) => s.openSheet);
  const closeSheet = useUIStore((s) => s.closeSheet);
  const editingId = useUIStore((s) => s.editingIncomeId);
  const open = openSheet === 'income';

  const addIncome = useStore((s) => s.addIncome);
  const updateIncome = useStore((s) => s.updateIncome);
  const deleteTransaction = useStore((s) => s.deleteTransaction);
  const transactions = useStore((s) => s.transactions);

  const [amount, setAmount] = useState('');
  const [concept, setConcept] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [showDate, setShowDate] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (editingId) {
      const tx = transactions.find((t) => t.id === editingId && t.type === 'income');
      if (tx && tx.type === 'income') {
        setAmount(String(tx.amount));
        setConcept(tx.concept);
        setDate(tx.date);
        return;
      }
    }
    setAmount('');
    setConcept('');
    setDate(new Date().toISOString().slice(0, 10));
    setShowDate(false);
  }, [open, editingId, transactions]);

  const numAmount = parseFloat(amount.replace(',', '.'));
  const canSave = numAmount > 0;

  function handleSave() {
    if (!canSave) return;
    if (editingId) {
      updateIncome(editingId, { amount: numAmount, concept, date });
    } else {
      addIncome({ amount: numAmount, concept, date });
    }
    closeSheet();
  }

  function handleDelete() {
    if (editingId) deleteTransaction(editingId);
    closeSheet();
  }

  return (
    <Sheet open={open} onClose={closeSheet} title={editingId ? 'Editar ingreso' : 'Añadir ingreso'}>
      <p className="text-center text-sm text-ink/50 dark:text-white/50 mb-1">¿Cuánto has ingresado?</p>
      <AmountInput value={amount} onChange={setAmount} />

      <p className="text-sm font-medium mb-2 mt-2">Concepto</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setConcept(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 ${
              concept === s
                ? 'border-brand bg-brand-light text-brand dark:bg-brand/20'
                : 'border-transparent bg-black/[0.04] dark:bg-white/5 text-ink/60 dark:text-white/60'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <input
        value={concept}
        onChange={(e) => setConcept(e.target.value)}
        placeholder="Ej. Nómina julio"
        className="w-full rounded-xl bg-black/[0.04] dark:bg-white/5 px-4 py-3 text-sm outline-none mb-3"
      />

      {!showDate ? (
        <button onClick={() => setShowDate(true)} className="text-sm text-brand font-medium mb-4">
          📅 {date === new Date().toISOString().slice(0, 10) ? 'Hoy' : date} · cambiar fecha
        </button>
      ) : (
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-xl bg-black/[0.04] dark:bg-white/5 px-4 py-3 text-sm outline-none mb-4"
        />
      )}

      <button
        onClick={handleSave}
        disabled={!canSave}
        className="w-full py-4 rounded-2xl bg-brand text-white font-semibold text-base disabled:opacity-30 active:scale-[0.98] transition-transform"
      >
        Guardar
      </button>

      {editingId && (
        <button onClick={handleDelete} className="w-full py-3 mt-2 rounded-2xl text-rose font-medium text-sm">
          Eliminar ingreso
        </button>
      )}
    </Sheet>
  );
}
