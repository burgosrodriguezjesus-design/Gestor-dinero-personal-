const eur = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatMoney(amount: number): string {
  return eur.format(amount);
}

export function formatMoneySigned(amount: number): string {
  const formatted = eur.format(Math.abs(amount));
  return amount < 0 ? `-${formatted}` : `+${formatted}`;
}

export function formatNumber(n: number, decimals = 0): string {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}
