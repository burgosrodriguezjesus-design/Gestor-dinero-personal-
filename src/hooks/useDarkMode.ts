import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export function useDarkMode() {
  const darkMode = useStore((s) => s.settings.darkMode);

  useEffect(() => {
    const root = document.documentElement;
    const apply = (isDark: boolean) => root.classList.toggle('dark', isDark);

    if (darkMode === 'dark') {
      apply(true);
      return;
    }
    if (darkMode === 'light') {
      apply(false);
      return;
    }

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    apply(mq.matches);
    const listener = (e: MediaQueryListEvent) => apply(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, [darkMode]);
}
