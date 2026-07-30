import { useEffect, useState } from 'react';
import { Sheet } from './Sheet';
import { AmountInput } from './AmountInput';
import { useStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';

export function AddExpenseSheet() {
  const openSheet = useUIStore((s) => s.openSheet);
  const closeSheet = useUIStore((s) => s.closeSheet);
  const editingId = useUIStore((s) => s.editingExpenseId);
  const open = openSheet === 'expense';

  const categories = useStore((s) => s.categories);
  const recentConcepts = useStore((s) => s.recentConcepts);
  const addExpense = useStore((s) => s.addExpense);
  const updateExpense = useStore((s) => s.updateExpense);
  const deleteTransaction = useStore((s) => s.deleteTransaction);
  const transactions = useStore((s) => s.transactions);
  const addCategory = useStore((s) => s.addCategory);

  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [concept, setConcept] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [showDate, setShowDate] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    if (!open) return;
    if (editingId) {
      const tx = transactions.find((t) => t.id === editingId && t.type === 'expense');
      if (tx && tx.type === 'expense') {
        setAmount(String(tx.amount));
        setCategoryId(tx.categoryId);
        setConcept(tx.concept);
        setDate(tx.date);
        return;
      }
    }
    setAmount('');
    setCategoryId(null);
    setConcept('');
    setDate(new Date().toISOString().slice(0, 10));
    setShowDate(false);
  }, [open, editingId, transactions]);

  const numAmount = parseFloat(amount.replace(',', '.'));
  const canSave = numAmount > 0 && !!categoryId;

  function handleSave() {
    if (!canSave || !categoryId) return;
    if (editingId) {
      updateExpense(editingId, { amount: numAmount, categoryId, concept, date });
    } else {
      addExpense({ amount: numAmount, categoryId, concept, date });
    }
    closeSheet();
  }

  function handleDelete() {
    if (editingId) deleteTransaction(editingId);
    closeSheet();
  }

  function handleAddCategory() {
    const name = newCategoryName.trim();
    if (!name) return;
    const cat = addCategory(name);
    setCategoryId(cat.id);
    setNewCategoryName('');
    setAddingCategory(false);
  }

  return (
    <Sheet open={open} onClose={closeSheet} title={editingId ? 'Editar gasto' : 'Añadir gasto'}>
      <p className="text-center text-sm text-ink/50 dark:text-white/50 mb-1">¿Cuánto has gastado?</p>
      <AmountInput value={amount} onChange={setAmount} />

      <p className="text-sm font-medium mb-2 mt-2">¿En qué?</p>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryId(cat.id)}
            className={`flex flex-col items-center gap-1 py-3 rounded-2xl text-xs font-medium border-2 transition-colors ${
              categoryId === cat.id
                ? 'border-brand bg-brand-light text-brand dark:bg-brand/20'
                : 'border-transparent bg-black/[0.04] dark:bg-white/5 text-ink/70 dark:text-white/70'
            }`}
          >
            <span className="text-xl">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
        {!addingCategory ? (
          <button
            onClick={() => setAddingCategory(true)}
            className="flex flex-col items-center gap-1 py-3 rounded-2xl text-xs font-medium border-2 border-dashed border-black/15 dark:border-white/20 text-ink/40 dark:text-white/40"
          >
            <span className="text-xl">➕</span>
            Nueva
          </button>
        ) : null}
      </div>

      {addingCategory && (
        <div className="flex gap-2 mb-4 animate-fade-in">
          <input
            autoFocus
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nombre de categoría"
            className="flex-1 rounded-xl bg-black/[0.04] dark:bg-white/5 px-3 py-2 text-sm outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
          />
          <button onClick={handleAddCategory} className="px-4 rounded-xl bg-brand text-white text-sm font-semibold">
            Añadir
          </button>
        </div>
      )}

      <p className="text-sm font-medium mb-2">¿Qué has comprado? <span className="text-ink/40 font-normal">(opcional)</span></p>
      <input
        value={concept}
        onChange={(e) => setConcept(e.target.value)}
        placeholder="Ej. Mercadona"
        list="concept-suggestions"
        className="w-full rounded-xl bg-black/[0.04] dark:bg-white/5 px-4 py-3 text-sm outline-none mb-3"
      />
      <datalist id="concept-suggestions">
        {recentConcepts.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>

      {!showDate ? (
        <button
          onClick={() => setShowDate(true)}
          className="text-sm text-brand font-medium mb-4"
        >
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
        <button
          onClick={handleDelete}
          className="w-full py-3 mt-2 rounded-2xl text-rose font-medium text-sm"
        >
          Eliminar gasto
        </button>
      )}
    </Sheet>
  );
}
