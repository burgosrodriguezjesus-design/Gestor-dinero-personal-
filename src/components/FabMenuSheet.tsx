import { Sheet } from './Sheet';
import { useUIStore } from '../store/useUIStore';

const options = [
  { key: 'expense', icon: '💸', label: 'Gasto', desc: 'Registra algo que has pagado' },
  { key: 'income', icon: '💰', label: 'Ingreso', desc: 'Registra dinero que has cobrado' },
  { key: 'goal', icon: '🎯', label: 'Objetivo', desc: 'Crea una meta de ahorro' },
  { key: 'fixed', icon: '📌', label: 'Gasto fijo', desc: 'Un gasto que se repite cada mes' },
] as const;

export function FabMenuSheet() {
  const openSheet = useUIStore((s) => s.openSheet);
  const setSheet = useUIStore((s) => s.setSheet);
  const closeSheet = useUIStore((s) => s.closeSheet);
  const open = openSheet === 'fab-menu';

  return (
    <Sheet open={open} onClose={closeSheet} title="Añadir">
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSheet(opt.key)}
            className="flex items-center gap-4 p-4 rounded-2xl bg-black/[0.03] dark:bg-white/5 active:scale-[0.98] transition-transform text-left"
          >
            <span className="text-2xl w-10 h-10 flex items-center justify-center rounded-full bg-card dark:bg-card-dark">
              {opt.icon}
            </span>
            <span>
              <span className="block font-semibold text-sm">{opt.label}</span>
              <span className="block text-xs text-ink/50 dark:text-white/50">{opt.desc}</span>
            </span>
          </button>
        ))}
      </div>
    </Sheet>
  );
}
