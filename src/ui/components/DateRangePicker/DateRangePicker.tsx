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

type Edge = "start" | "end";

// Inline "od – do" range calendar, booking/airline style: two summary fields
// on top (the highlighted one is what the next click sets), two months side
// by side (one on narrow containers), hover preview of the range.
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
  const [editing, setEditing] = useState<Edge>(value.start && !value.end ? "end" : "start");
  const [hovered, setHovered] = useState<Date | null>(null);

  const { start, end } = value;
  const canGoBack = viewMonth > startOfMonth(min);

  // the end of the range as currently drawn: the real end, or — while the
  // visitor is picking it — the day under the pointer
  const previewEnd =
    end ?? (editing === "end" && start && hovered && hovered >= start ? hovered : null);

  function pick(day: Date) {
    if (editing === "start" || !start || day < start) {
      // a fresh start; keep an existing end only if it's still after it
      onChange({ start: day, end: end && day <= end && editing === "start" ? end : null });
      setEditing("end");
      return;
    }
    onChange({ start, end: day });
    setEditing("start");
  }

  function clear() {
    onChange({ start: null, end: null });
    setEditing("start");
  }

  function focusEdge(edge: Edge) {
    setEditing(edge);
    const target = edge === "start" ? start : end ?? start;
    if (target) setViewMonth(startOfMonth(target));
  }

  const months = [viewMonth, addMonths(viewMonth, 1)];

  return (
    <div className={`${styles.picker} ${className}`} data-invalid={invalid || undefined}>
      <div className={styles.summary}>
        {(["start", "end"] as const).map((edge) => {
          const date = edge === "start" ? start : end;
          return (
            <button
              key={edge}
              type="button"
              className={styles.summaryField}
              data-active={editing === edge}
              onClick={() => focusEdge(edge)}
            >
              <span className={styles.summaryLabel}>
                {edge === "start" ? startLabel : endLabel}
              </span>
              <span className={styles.summaryValue} data-empty={!date}>
                {date ? formatShort(date) : "Vyberte dátum"}
              </span>
            </button>
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
              <p className={styles.monthTitle} aria-live={monthIndex === 0 ? "polite" : undefined}>
                {formatMonth(month)}
              </p>

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
                  const selected = isSameDay(day, start) || isSameDay(day, end);

                  return (
                    <button
                      key={day.getTime()}
                      type="button"
                      className={styles.day}
                      disabled={disabled}
                      data-start={isStart || undefined}
                      data-end={isEnd || undefined}
                      data-range-edge={(isStart || isEnd) && !!previewEnd && !isSameDay(start, previewEnd) ? "true" : undefined}
                      data-in-range={inRange || undefined}
                      data-today={isSameDay(day, today) || undefined}
                      data-weekend={isWeekend(day) || undefined}
                      aria-pressed={selected}
                      aria-label={formatLong(day)}
                      onClick={() => pick(day)}
                      onMouseEnter={() => setHovered(day)}
                    >
                      <span>{day.getDate()}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <span className={styles.hint}>
            {editing === "start" ? "Vyberte prvý možný deň" : "Vyberte posledný možný deň"}
          </span>
          {(start || end) && (
            <button type="button" className={styles.clear} onClick={clear}>
              Vymazať
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
