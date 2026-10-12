import { useMemo, useState } from "react";

import {
  WEEKDAYS,
  addMonths,
  formatLong,
  formatMonth,
  formatShort,
  isSameDay,
  isWeekend,
  monthGrid,
  startOfDay,
  startOfMonth,
} from "./dates";

import styles from "./DateRangePicker.module.css";

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (next: DateRange) => void;
  /** earliest selectable day — defaults to today */
  minDate?: Date;
  /** labels of the two summary fields */
  startLabel?: string;
  endLabel?: string;
  invalid?: boolean;
  className?: string;
}

// Inline "od – do" range calendar, booking/airline style. Deliberately one
// rule only: 1st tap = first day, 2nd tap = last day, a 3rd tap starts over.
// While the last day is pending, a bubble over the first day says so.
export default function DateRangePicker({
  value,
  onChange,
  minDate,
  startLabel = "Od",
  endLabel = "Do",
  invalid,
  className = "",
}: DateRangePickerProps) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const min = minDate ? startOfDay(minDate) : today;

  const [viewMonth, setViewMonth] = useState(() => startOfMonth(value.start ?? min));
  const [hovered, setHovered] = useState<Date | null>(null);

  const { start, end } = value;
  const pickingEnd = !!start && !end;
  const canGoBack = viewMonth > startOfMonth(min);

  // the end as currently drawn: the real end, or — while picking it with a
  // mouse — the day under the pointer
  const previewEnd = end ?? (start && !end && hovered && hovered >= start ? hovered : null);

  function pick(day: Date) {
    if (start && !end && day >= start) {
      onChange({ start, end: day });
    } else {
      // first tap, a tap before the current start, or a fresh range
      onChange({ start: day, end: null });
    }
    setHovered(null);
  }

  const months = [viewMonth, addMonths(viewMonth, 1)];

  return (
    <div className={`${styles.picker} ${className}`} data-invalid={invalid || undefined}>
      <div className={styles.summary} aria-live="polite">
        {(["start", "end"] as const).map((edge) => {
          const date = edge === "start" ? start : end;
          const next = edge === "start" ? !start || !!end : pickingEnd;
          return (
            <div key={edge} className={styles.summaryField} data-active={next}>
              <span className={styles.summaryLabel}>
                {edge === "start" ? startLabel : endLabel}
              </span>
              <span className={styles.summaryValue} data-empty={!date}>
                {date ? formatShort(date) : "Vyberte v kalendári"}
              </span>
            </div>
          );
        })}
      </div>

      <div className={styles.calendar}>
        <div className={styles.nav}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => setViewMonth((m) => addMonths(m, -1))}
            disabled={!canGoBack}
            aria-label="Predchádzajúci mesiac"
          >
            ‹
          </button>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => setViewMonth((m) => addMonths(m, 1))}
            aria-label="Nasledujúci mesiac"
          >
            ›
          </button>
        </div>

        <div className={styles.months} onMouseLeave={() => setHovered(null)}>
          {months.map((month, monthIndex) => (
            <div
              key={month.getTime()}
              className={styles.month}
              data-secondary={monthIndex === 1 || undefined}
            >
              <p className={styles.monthTitle}>{formatMonth(month)}</p>

              <div className={styles.grid} role="grid" aria-label={formatMonth(month)}>
                {WEEKDAYS.map((weekday) => (
                  <span key={weekday} className={styles.weekday} aria-hidden>
                    {weekday}
                  </span>
                ))}

                {monthGrid(month).map((day, index) => {
                  if (!day) return <span key={`empty-${index}`} />;

                  const disabled = day < min;
                  const isStart = isSameDay(day, start);
                  const isEnd = isSameDay(day, previewEnd);
                  const inRange = !!start && !!previewEnd && day > start && day < previewEnd;
                  const isRange = !!previewEnd && !isSameDay(start, previewEnd);
                  // weekday column 0–6 → which way the bubble may extend
                  const column = (day.getDay() + 6) % 7;
                  const showTip = isStart && pickingEnd && !hovered;

                  return (
                    <button
                      key={day.getTime()}
                      type="button"
                      className={styles.day}
                      disabled={disabled}
                      data-start={isStart || undefined}
                      data-end={isEnd || undefined}
                      data-range-edge={(isStart || isEnd) && isRange ? "true" : undefined}
                      data-in-range={inRange || undefined}
                      data-today={isSameDay(day, today) || undefined}
                      data-weekend={isWeekend(day) || undefined}
                      aria-pressed={isSameDay(day, start) || isSameDay(day, end)}
                      aria-label={formatLong(day)}
                      onClick={() => pick(day)}
                      onMouseEnter={() => pickingEnd && setHovered(day)}
                    >
                      <span className={styles.num}>{day.getDate()}</span>
                      {showTip && (
                        <span
                          className={styles.tip}
                          data-align={column < 2 ? "left" : column > 4 ? "right" : "center"}
                          role="status"
                        >
                          Teraz vyberte posledný deň
                          <small>alebo ťuknite znova pre 1 deň</small>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {(start || end) && (
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.clear}
              onClick={() => onChange({ start: null, end: null })}
            >
              Vymazať výber
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
