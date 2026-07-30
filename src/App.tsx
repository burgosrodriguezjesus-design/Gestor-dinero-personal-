import { HashRouter, Routes, Route } from 'react-router-dom';
import { useStore } from './store/useStore';
import { useDarkMode } from './hooks/useDarkMode';
import { Onboarding } from './components/Onboarding';
import { GlobalSheets } from './components/GlobalSheets';
import { Home } from './pages/Home';
import { Expenses } from './pages/Expenses';
import { Analysis } from './pages/Analysis';
import { Savings } from './pages/Savings';
import { More } from './pages/More';
import { Budgets } from './pages/Budgets';
import { FixedExpenses } from './pages/FixedExpenses';
import { Subscriptions } from './pages/Subscriptions';
import { Debts } from './pages/Debts';
import { Plan } from './pages/Plan';
import { Evolution } from './pages/Evolution';
import { Calculator } from './pages/Calculator';
import { Settings } from './pages/Settings';

function App() {
  useDarkMode();
  const onboardingDone = useStore((s) => s.settings.onboardingDone);

  if (!onboardingDone) {
    return <Onboarding />;
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gastos" element={<Expenses />} />
        <Route path="/analisis" element={<Analysis />} />
        <Route path="/ahorro" element={<Savings />} />
        <Route path="/mas" element={<More />} />
        <Route path="/mas/presupuestos" element={<Budgets />} />
        <Route path="/mas/gastos-fijos" element={<FixedExpenses />} />
        <Route path="/mas/suscripciones" element={<Subscriptions />} />
        <Route path="/mas/deudas" element={<Debts />} />
        <Route path="/mas/plan" element={<Plan />} />
        <Route path="/mas/evolucion" element={<Evolution />} />
        <Route path="/mas/calculadora" element={<Calculator />} />
        <Route path="/mas/ajustes" element={<Settings />} />
      </Routes>
      <GlobalSheets />
    </HashRouter>
  );
}

export default App;
