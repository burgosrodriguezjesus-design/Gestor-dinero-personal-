import type { ReactNode } from 'react';
import { BottomNav } from './BottomNav';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh flex flex-col">
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-6 pb-28">{children}</main>
      <BottomNav />
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-5">
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && <p className="text-sm text-ink/50 dark:text-white/50 mt-0.5">{subtitle}</p>}
    </header>
  );
}
