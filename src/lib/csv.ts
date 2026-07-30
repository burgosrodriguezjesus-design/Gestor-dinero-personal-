import type { Transaction, Category } from '../types';

export function expensesToCSV(transactions: Transaction[], categories: Category[]): string {
  const header = ['Fecha', 'Tipo', 'Categoría', 'Concepto', 'Importe'];
  const rows = transactions
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((t) => {
      if (t.type === 'expense') {
        const cat = categories.find((c) => c.id === t.categoryId);
        return [t.date, 'Gasto', cat?.name ?? 'Otros', t.concept, `-${t.amount}`];
      }
      return [t.date, 'Ingreso', '', t.concept, `${t.amount}`];
    });
  const lines = [header, ...rows].map((row) =>
    row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';')
  );
  return lines.join('\n');
}

export function downloadTextFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
