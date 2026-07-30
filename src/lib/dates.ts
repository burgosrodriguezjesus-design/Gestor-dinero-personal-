import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  isWithinInterval,
  parseISO,
  differenceInCalendarDays,
  getDaysInMonth,
  format,
  subMonths,
} from 'date-fns';
import { es } from 'date-fns/locale';

export const MONTH_NAMES_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

export function isInRange(dateStr: string, start: Date, end: Date): boolean {
  const d = parseISO(dateStr);
  return isWithinInterval(d, { start, end });
}

export function isThisMonth(dateStr: string, ref = new Date()): boolean {
  return isInRange(dateStr, startOfMonth(ref), endOfMonth(ref));
}

export function isLastMonth(dateStr: string, ref = new Date()): boolean {
  const last = subMonths(ref, 1);
  return isInRange(dateStr, startOfMonth(last), endOfMonth(last));
}

export function isToday(dateStr: string, ref = new Date()): boolean {
  return dateStr === format(ref, 'yyyy-MM-dd');
}

export function isThisWeek(dateStr: string, ref = new Date()): boolean {
  return isInRange(dateStr, startOfWeek(ref, { weekStartsOn: 1 }), ref);
}

export function daysLeftInMonth(ref = new Date()): number {
  const end = endOfMonth(ref);
  const diff = differenceInCalendarDays(end, ref);
  return Math.max(diff + 1, 1); // include today
}

export function totalDaysInMonth(ref = new Date()): number {
  return getDaysInMonth(ref);
}

export function monthLabel(ref = new Date()): string {
  return format(ref, "MMMM yyyy", { locale: es });
}

export function shortMonthLabel(ref = new Date()): string {
  return format(ref, "MMM", { locale: es });
}

export function monthKey(ref = new Date()): string {
  return format(ref, 'yyyy-MM');
}

export function friendlyDateGroup(dateStr: string): string {
  if (isToday(dateStr)) return 'Hoy';
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (dateStr === format(yesterday, 'yyyy-MM-dd')) return 'Ayer';
  return format(parseISO(dateStr), "d 'de' MMMM", { locale: es });
}

export { format, parseISO, startOfMonth, endOfMonth, subMonths };
