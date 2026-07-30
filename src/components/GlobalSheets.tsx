import { FabMenuSheet } from './FabMenuSheet';
import { AddExpenseSheet } from './AddExpenseSheet';
import { AddIncomeSheet } from './AddIncomeSheet';
import { AddGoalSheet } from './AddGoalSheet';
import { AddFixedExpenseSheet } from './AddFixedExpenseSheet';

export function GlobalSheets() {
  return (
    <>
      <FabMenuSheet />
      <AddExpenseSheet />
      <AddIncomeSheet />
      <AddGoalSheet />
      <AddFixedExpenseSheet />
    </>
  );
}
