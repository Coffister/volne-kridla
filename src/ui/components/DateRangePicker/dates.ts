// Small local-date helpers for DateRangePicker. Everything works on local
// midnight Dates so comparisons never trip over time-of-day or DST.

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const addDays = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

export const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);

export const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

export const isSameDay = (a: Date | null, b: Date | null) =>
  !!a && !!b && a.getTime() === b.getTime();

export const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

/** Monday-first 6×7 grid for the month of `month`; days outside it are null. */
export function monthGrid(month: Date): (Date | null)[] {
  const first = startOfMonth(month);
  // getDay(): 0 = Sunday → shift so Monday is column 0
  const lead = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();

  const cells: (Date | null)[] = Array.from({ length: lead }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(first.getFullYear(), first.getMonth(), day));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

/** "2026-10-12" — stable, timezone-free value to store/send. */
export const toIsoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const monthTitle = new Intl.DateTimeFormat("sk-SK", { month: "long", year: "numeric" });
const shortDate = new Intl.DateTimeFormat("sk-SK", { weekday: "short", day: "numeric", month: "numeric", year: "numeric" });
const longDate = new Intl.DateTimeFormat("sk-SK", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export const formatMonth = (d: Date) => monthTitle.format(d);
/** "po 12. 10. 2026" */
export const formatShort = (d: Date) => shortDate.format(d);
/** "pondelok 12. októbra 2026" — used for screen-reader day labels */
export const formatLong = (d: Date) => longDate.format(d);

export const WEEKDAYS = ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"];
