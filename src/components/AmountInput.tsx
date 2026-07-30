export function AmountInput({
  value,
  onChange,
  autoFocus = true,
}: {
  value: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <input
        type="number"
        inputMode="decimal"
        step="0.01"
        min="0"
        autoFocus={autoFocus}
        placeholder="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-40 text-center text-5xl font-bold bg-transparent outline-none placeholder:text-ink/20 dark:placeholder:text-white/20"
      />
      <span className="text-3xl font-bold text-ink/40 dark:text-white/40">€</span>
    </div>
  );
}
