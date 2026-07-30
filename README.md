# Mi Cuaderno — Finanzas personales

Aplicación personal para llevar tus cuentas a mano: ingresos, gastos, presupuestos, objetivos de ahorro, gastos fijos, suscripciones y deudas. **Todo se introduce manualmente**, no se conecta a ningún banco, tarjeta o cuenta.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4 (diseño mobile-first)
- Zustand con persistencia en `localStorage` (la capa de datos vive en `src/store/`, lista para cambiarse por una base de datos real en el futuro)
- Recharts para gráficos
- React Router (HashRouter) para la navegación

## Desarrollo

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
npm run preview
```

## Estructura

- `src/types` — modelos de datos (gastos, ingresos, presupuestos, objetivos, deudas...)
- `src/store` — estado global (Zustand) y lógica de persistencia
- `src/lib` — cálculos financieros puros (resumen mensual, "puedes gastar", proyecciones, consejos, calculadora de ahorro, CSV)
- `src/components` — componentes reutilizables (tarjetas, hojas inferiores, navegación)
- `src/pages` — pantallas de la aplicación

## Privacidad

No se solicitan credenciales bancarias ni se realiza ninguna conexión externa. Los datos se guardan únicamente en el dispositivo del usuario. Se puede exportar/importar una copia de seguridad en JSON, y exportar los gastos a CSV, desde Ajustes.
