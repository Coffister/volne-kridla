import { useEffect, useId, useMemo, useRef, useState } from "react";

import styles from "./CityInput.module.css";

// [name, okres, isTown] — every Slovak municipality (Wikidata, "obec na
// Slovensku"), loaded lazily so the ~19 kB list never ships with the page
type Obec = [string, string, number];

let obceCache: Obec[] | null = null;
function loadObce(): Promise<Obec[]> {
  if (obceCache) return Promise.resolve(obceCache);
  return import("./obce.json").then((m) => {
    obceCache = m.default as Obec[];
    return obceCache;
  });
}

// "Žiar nad Hronom" → "ziar nad hronom", so typing without diacritics works
const fold = (s: string) =>
  s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();

const MAX_SUGGESTIONS = 6;
const MIN_CHARS = 2;

interface Suggestion {
  name: string;
  okres: string;
  /** what goes into the field — "Zálesie (Senec)" when the name isn't unique */
  value: string;
}

function search(obce: Obec[], ambiguous: Set<string>, query: string): Suggestion[] {
  const q = fold(query);
  if (q.length < MIN_CHARS) return [];

  const scored: { s: Suggestion; score: number }[] = [];
  for (const [name, okres, isTown] of obce) {
    const f = fold(name);
    let score: number;
    if (f.startsWith(q)) score = 0;
    else if (f.split(/[\s-]+/).some((w) => w.startsWith(q))) score = 1;
    else if (f.includes(q)) score = 2;
    else continue;
    // towns first within the same match quality
    if (!isTown) score += 0.5;
    const value = ambiguous.has(name) && okres ? `${name} (${okres})` : name;
    scored.push({ s: { name, okres, value }, score });
  }

  return scored
    .sort((a, b) => a.score - b.score || a.s.name.localeCompare(b.s.name, "sk"))
    .slice(0, MAX_SUGGESTIONS)
    .map((x) => x.s);
}

interface CityInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
}

// Free-text city field with suggestions from the list of Slovak
// municipalities. Anything can still be typed (a Czech town, a district of
// Bratislava) — the list only helps, it never blocks.
export default function CityInput({ id, value, onChange, invalid }: CityInputProps) {
  const listId = useId();
  const [obce, setObce] = useState<Obec[] | null>(obceCache);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!obce) loadObce().then(setObce).catch(() => setObce([]));
  }, [obce]);

  const ambiguous = useMemo(() => {
    const seen = new Set<string>();
    const dup = new Set<string>();
    for (const [name] of obce ?? []) (seen.has(name) ? dup : seen).add(name);
    return dup;
  }, [obce]);

  const suggestions = useMemo(
    () => (obce ? search(obce, ambiguous, value) : []),
    [obce, ambiguous, value],
  );

  // nothing to suggest once the field already holds exactly one of them
  const showList =
    open && suggestions.length > 0 && !(suggestions.length === 1 && suggestions[0].value === value);

  function pick(s: Suggestion) {
    onChange(s.value);
    setOpen(false);
    setActive(-1);
  }

  return (
    <div className={styles.wrap}>
      <input
        ref={inputRef}
        id={id}
        type="text"
        autoComplete="off"
        maxLength={200}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={showList && active >= 0 ? `${listId}-${active}` : undefined}
        aria-invalid={invalid}
        placeholder="Začnite písať, napr. Trnava"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        // delay so a tap on a suggestion lands before the list unmounts
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (!showList) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((i) => (i + 1) % suggestions.length);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
          } else if (e.key === "Enter" && active >= 0) {
            e.preventDefault();
            pick(suggestions[active]);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
      />

      {showList && (
        <ul id={listId} role="listbox" className={styles.list}>
          {suggestions.map((s, i) => (
            <li
              key={`${s.name}-${s.okres}`}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              className={styles.option}
              data-active={i === active || undefined}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(s)}
              onMouseEnter={() => setActive(i)}
            >
              <span className={styles.name}>{s.name}</span>
              {s.okres && <span className={styles.okres}>okres {s.okres}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
