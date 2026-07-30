import { useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { Layout, PageHeader } from '../components/Layout';
import { Card, SectionTitle } from '../components/Card';
import { downloadTextFile, expensesToCSV } from '../lib/csv';

const DARK_OPTIONS = [
  { key: 'system', label: 'Automático' },
  { key: 'light', label: 'Claro' },
  { key: 'dark', label: 'Oscuro' },
] as const;

export function Settings() {
  const settings = useStore((s) => s.settings);
  const setSettings = useStore((s) => s.setSettings);
  const balance = useStore((s) => s.balance);
  const setInitialBalance = useStore((s) => s.setInitialBalance);
  const transactions = useStore((s) => s.transactions);
  const categories = useStore((s) => s.categories);
  const exportJSON = useStore((s) => s.exportJSON);
  const importJSON = useStore((s) => s.importJSON);
  const resetAll = useStore((s) => s.resetAll);

  const [balanceInput, setBalanceInput] = useState('');
  const [editingBalance, setEditingBalance] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExportJSON() {
    downloadTextFile(`mi-cuaderno-backup-${new Date().toISOString().slice(0, 10)}.json`, exportJSON(), 'application/json');
  }

  function handleExportCSV() {
    downloadTextFile(`mis-gastos-${new Date().toISOString().slice(0, 10)}.csv`, expensesToCSV(transactions, categories), 'text/csv');
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = importJSON(String(reader.result));
      setMessage(result.ok ? 'Datos importados correctamente.' : result.error ?? 'Error al importar.');
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function handleSaveBalance() {
    const n = parseFloat(balanceInput);
    if (!Number.isNaN(n)) setInitialBalance(n);
    setEditingBalance(false);
  }

  return (
    <Layout>
      <PageHeader title="⚙️ Ajustes" />

      <SectionTitle>Dinero disponible</SectionTitle>
      <Card className="mb-5">
        {editingBalance ? (
          <div className="flex gap-2">
            <input
              autoFocus
              type="number"
              inputMode="decimal"
              value={balanceInput}
              onChange={(e) => setBalanceInput(e.target.value)}
              placeholder={String(balance)}
              className="flex-1 rounded-xl bg-black/[0.04] dark:bg-white/5 px-4 py-3 text-sm outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleSaveBalance()}
            />
            <button onClick={handleSaveBalance} className="px-4 rounded-xl bg-brand text-white text-sm font-semibold">
              Guardar
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setBalanceInput(String(balance));
              setEditingBalance(true);
            }}
            className="w-full text-left"
          >
            <p className="text-xs text-ink/50 dark:text-white/50 mb-0.5">Ajustar manualmente</p>
            <p className="text-sm text-brand font-semibold">Editar dinero disponible →</p>
          </button>
        )}
      </Card>

      <SectionTitle>Apariencia</SectionTitle>
      <Card className="mb-5">
        <div className="grid grid-cols-3 gap-2">
          {DARK_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSettings({ darkMode: opt.key })}
              className={`py-2.5 rounded-xl text-sm font-medium ${
                settings.darkMode === opt.key ? 'bg-brand text-white' : 'bg-black/[0.05] dark:bg-white/10 text-ink/60 dark:text-white/60'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Card>

      <SectionTitle>Modo "no me puedo pasar"</SectionTitle>
      <Card className="mb-5 flex items-center justify-between">
        <div className="pr-4">
          <p className="text-sm font-medium">Límite de gasto diario</p>
          <p className="text-xs text-ink/50 dark:text-white/50 mt-0.5">
            Muestra en Inicio cuánto puedes gastar cada día para no pasarte de tu presupuesto.
          </p>
        </div>
        <button
          onClick={() => setSettings({ noOverspendMode: !settings.noOverspendMode })}
          className={`shrink-0 w-12 h-7 rounded-full relative transition-colors ${settings.noOverspendMode ? 'bg-brand' : 'bg-black/15 dark:bg-white/15'}`}
        >
          <span
            className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${settings.noOverspendMode ? 'translate-x-5' : ''}`}
          />
        </button>
      </Card>

      <SectionTitle>Copia de seguridad</SectionTitle>
      <div className="flex flex-col gap-2 mb-5">
        <button onClick={handleExportJSON} className="bg-card dark:bg-card-dark rounded-2xl p-4 text-left text-sm font-medium">
          ⬇️ Exportar todos mis datos (JSON)
        </button>
        <button onClick={handleImportClick} className="bg-card dark:bg-card-dark rounded-2xl p-4 text-left text-sm font-medium">
          ⬆️ Importar datos (JSON)
        </button>
        <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileChange} />
        <button onClick={handleExportCSV} className="bg-card dark:bg-card-dark rounded-2xl p-4 text-left text-sm font-medium">
          📄 Exportar gastos a CSV
        </button>
        {message && <p className="text-xs text-center text-ink/50 dark:text-white/50">{message}</p>}
      </div>

      <SectionTitle>Datos</SectionTitle>
      <button
        onClick={() => {
          if (confirm('¿Seguro que quieres borrar todos tus datos? Esta acción no se puede deshacer.')) {
            resetAll();
          }
        }}
        className="w-full bg-rose-light dark:bg-rose/15 text-rose rounded-2xl p-4 text-sm font-semibold"
      >
        Borrar todos los datos
      </button>

      <p className="text-center text-xs text-ink/30 dark:text-white/30 mt-6">
        Todos los datos se guardan solo en este dispositivo. Nunca nos conectamos a bancos ni tarjetas.
      </p>
    </Layout>
  );
}
