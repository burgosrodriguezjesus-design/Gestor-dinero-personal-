import { Link } from 'react-router-dom';
import { Layout, PageHeader } from '../components/Layout';

const sections = [
  { to: '/mas/presupuestos', icon: '📋', label: 'Presupuestos', desc: 'Límite de gasto por categoría' },
  { to: '/mas/plan', icon: '📅', label: 'Plan de mes', desc: 'Planifica ingresos y gastos antes de empezar' },
  { to: '/mas/gastos-fijos', icon: '📌', label: 'Gastos fijos', desc: 'Alquiler, seguro, gimnasio...' },
  { to: '/mas/suscripciones', icon: '📺', label: 'Suscripciones', desc: 'Netflix, Spotify, Amazon...' },
  { to: '/mas/deudas', icon: '💳', label: 'Deudas', desc: 'Controla lo que debes y lo que ya pagaste' },
  { to: '/mas/evolucion', icon: '📈', label: 'Mi evolución', desc: 'Ahorro mes a mes y resumen mensual' },
  { to: '/mas/calculadora', icon: '🧮', label: 'Calculadora de ahorro', desc: '¿Cuánto tardaré en conseguirlo?' },
  { to: '/mas/ajustes', icon: '⚙️', label: 'Ajustes', desc: 'Modo oscuro, copia de seguridad, modo diario' },
];

export function More() {
  return (
    <Layout>
      <PageHeader title="Más" />
      <div className="flex flex-col gap-2">
        {sections.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className="flex items-center gap-4 bg-card dark:bg-card-dark rounded-2xl p-4 active:scale-[0.98] transition-transform"
          >
            <span className="text-2xl w-11 h-11 flex items-center justify-center rounded-full bg-black/[0.04] dark:bg-white/10 shrink-0">
              {s.icon}
            </span>
            <span className="flex-1">
              <span className="block font-semibold text-sm">{s.label}</span>
              <span className="block text-xs text-ink/50 dark:text-white/50">{s.desc}</span>
            </span>
            <span className="text-ink/30 dark:text-white/30">›</span>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
