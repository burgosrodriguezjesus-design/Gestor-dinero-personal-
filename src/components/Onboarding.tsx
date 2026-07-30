import { useState } from 'react';
import { useStore } from '../store/useStore';

export function Onboarding() {
  const setInitialBalance = useStore((s) => s.setInitialBalance);
  const [amount, setAmount] = useState('');

  const canSave = amount.trim() !== '' && !Number.isNaN(parseFloat(amount));

  return (
    <div className="min-h-svh flex flex-col justify-center px-6 max-w-md mx-auto">
      <div className="text-center mb-8 animate-fade-in">
        <div className="text-5xl mb-4">📓</div>
        <h1 className="text-2xl font-bold mb-2">Bienvenido a tu cuaderno financiero</h1>
        <p className="text-ink/60 dark:text-white/60 text-sm">
          Todo se introduce a mano. Nada se conecta a bancos ni tarjetas. Empecemos por saber
          cuánto dinero tienes disponible ahora mismo.
        </p>
      </div>

      <p className="text-center text-sm font-medium mb-1">¿Cuánto dinero tienes disponible?</p>
      <div className="flex items-center justify-center gap-2 py-4">
        <input
          type="number"
          inputMode="decimal"
          autoFocus
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-40 text-center text-5xl font-bold bg-transparent outline-none placeholder:text-ink/20 dark:placeholder:text-white/20"
        />
        <span className="text-3xl font-bold text-ink/40 dark:text-white/40">€</span>
      </div>

      <button
        disabled={!canSave}
        onClick={() => setInitialBalance(parseFloat(amount))}
        className="w-full py-4 rounded-2xl bg-brand text-white font-semibold text-base disabled:opacity-30 active:scale-[0.98] transition-transform mt-4"
      >
        Empezar
      </button>
      <p className="text-center text-xs text-ink/40 dark:text-white/40 mt-4">
        Podrás ajustarlo cuando quieras desde Ajustes.
      </p>
    </div>
  );
}
