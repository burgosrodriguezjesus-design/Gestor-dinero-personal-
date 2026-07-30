import { useState } from 'react';
import { Sheet } from './Sheet';
import { useStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';

export function AddGoalSheet() {
  const openSheet = useUIStore((s) => s.openSheet);
  const closeSheet = useUIStore((s) => s.closeSheet);
  const open = openSheet === 'goal';
  const addGoal = useStore((s) => s.addGoal);

  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const canSave = name.trim().length > 0 && parseFloat(target) > 0;

  function handleSave() {
    if (!canSave) return;
    addGoal({
      name: name.trim(),
      target: parseFloat(target),
      current: parseFloat(current) || 0,
      targetDate: targetDate || undefined,
    });
    setName('');
    setTarget('');
    setCurrent('');
    setTargetDate('');
    closeSheet();
  }

  return (
    <Sheet open={open} onClose={closeSheet} title="Nuevo objetivo">
      <p className="text-sm font-medium mb-2">Nombre del objetivo</p>
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ej. Fondo de emergencia"
        className="w-full rounded-xl bg-black/[0.04] dark:bg-white/5 px-4 py-3 text-sm outline-none mb-3"
      />
      <p className="text-sm font-medium mb-2">¿Cuánto quieres conseguir?</p>
      <input
        type="number"
        inputMode="decimal"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="5000"
        className="w-full rounded-xl bg-black/[0.04] dark:bg-white/5 px-4 py-3 text-sm outline-none mb-3"
      />
      <p className="text-sm font-medium mb-2">¿Cuánto tienes ya ahorrado? <span className="text-ink/40 font-normal">(opcional)</span></p>
      <input
        type="number"
        inputMode="decimal"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        placeholder="0"
        className="w-full rounded-xl bg-black/[0.04] dark:bg-white/5 px-4 py-3 text-sm outline-none mb-3"
      />
      <p className="text-sm font-medium mb-2">Fecha objetivo <span className="text-ink/40 font-normal">(opcional)</span></p>
      <input
        type="date"
        value={targetDate}
        onChange={(e) => setTargetDate(e.target.value)}
        className="w-full rounded-xl bg-black/[0.04] dark:bg-white/5 px-4 py-3 text-sm outline-none mb-4"
      />

      <button
        onClick={handleSave}
        disabled={!canSave}
        className="w-full py-4 rounded-2xl bg-brand text-white font-semibold text-base disabled:opacity-30 active:scale-[0.98] transition-transform"
      >
        Crear objetivo
      </button>
    </Sheet>
  );
}
