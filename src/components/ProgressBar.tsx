export function ProgressBar({
  percent,
  color = 'brand',
}: {
  percent: number;
  color?: 'brand' | 'amber' | 'rose';
}) {
  const clamped = Math.max(0, Math.min(percent, 100));
  const colorClass = {
    brand: 'bg-brand',
    amber: 'bg-amber',
    rose: 'bg-rose',
  }[color];
  return (
    <div className="w-full h-2.5 rounded-full bg-black/[0.06] dark:bg-white/10 overflow-hidden">
      <div
        className={`h-full rounded-full ${colorClass} transition-[width] duration-500 ease-out`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
