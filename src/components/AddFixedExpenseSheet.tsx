import { useState } from 'react';
import { Sheet } from './Sheet';
import { useStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';

export function AddFixedExpenseSheet() {
  const openSheet = useUIStore((s) => s.openSheet);
  const closeSheet = useUIStore((s) => s.closeSheet);
  const open = openSheet === 'fixed';
  const addFixedExpense = useStore((s) => s.addFixedExpense);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const canSave = name.trim().length > 0 && parseFloat(amount) > 0;

  function handleSave() {
    if (!canSave) return;
    addFixedExpense({ name: name.trim(), amount: parseFloat(amount) });
    setName('');
    setAmount('');
    closeSheet();
  }

  return (
    <Sheet open={open} onClose={closeSheet} title="Nuevo gasto fijo">
      <p className="text-sm font-medium mb-2">Nombre</p>
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ej. Alquiler, Netflix, Gimnasio..."
        className="w-full rounded-xl bg-black/[0.04] dark:bg-white/5 px-4 py-3 text-sm outline-none mb-3"
      />
      <p className="text-sm font-medium mb-2">Importe mensual</p>
      <input
        type="number"
        inputMode="decimal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0"
        className="w-full rounded-xl bg-black/[0.04] dark:bg-white/5 px-4 py-3 text-sm outline-none mb-4"
      />

      <button
        onClick={handleSave}
        disabled={!canSave}
        className="w-full py-4 rounded-2xl bg-brand text-white font-semibold text-base disabled:opacity-30 active:scale-[0.98] transition-transform"
      >
        Guardar
      </button>
    </Sheet>
  );
}
