import type { ReactNode } from 'react';

export function Card({
  children,
  className = '',
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp
      onClick={onClick}
      className={`bg-card dark:bg-card-dark rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 text-left w-full ${
        onClick ? 'active:scale-[0.98] transition-transform' : ''
      } ${className}`}
    >
      {children}
    </Comp>
  );
}

export function SectionTitle({ children, emoji }: { children: ReactNode; emoji?: string }) {
  return (
    <h2 className="text-sm font-semibold text-ink/60 dark:text-white/50 uppercase tracking-wide mb-3 flex items-center gap-1.5">
      {emoji && <span className="text-base">{emoji}</span>}
      {children}
    </h2>
  );
}
