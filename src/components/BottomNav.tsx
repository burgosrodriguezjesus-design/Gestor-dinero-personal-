import { NavLink } from 'react-router-dom';
import { useUIStore } from '../store/useUIStore';

const items = [
  { to: '/', label: 'Inicio', icon: '🏠' },
  { to: '/gastos', label: 'Gastos', icon: '💸' },
  { to: '/analisis', label: 'Análisis', icon: '📊' },
  { to: '/ahorro', label: 'Ahorro', icon: '🎯' },
  { to: '/mas', label: 'Más', icon: '☰' },
];

export function BottomNav() {
  const setSheet = useUIStore((s) => s.setSheet);

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-card/95 dark:bg-card-dark/95 backdrop-blur border-t border-black/5 dark:border-white/10 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-md mx-auto relative flex items-stretch h-16">
        {items.slice(0, 2).map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
        <div className="w-16 shrink-0" />
        {items.slice(2).map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
        <button
          onClick={() => setSheet('fab-menu')}
          aria-label="Añadir"
          className="absolute left-1/2 -translate-x-1/2 -top-6 w-14 h-14 rounded-full bg-brand text-white text-3xl leading-none flex items-center justify-center shadow-lg shadow-brand/30 active:scale-95 transition-transform"
        >
          +
        </button>
      </div>
    </nav>
  );
}

function NavItem({ to, label, icon }: { to: string; label: string; icon: string }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `flex-1 flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
          isActive ? 'text-brand' : 'text-ink/40 dark:text-white/40'
        }`
      }
    >
      <span className="text-lg leading-none">{icon}</span>
      {label}
    </NavLink>
  );
}
