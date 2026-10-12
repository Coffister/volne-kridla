import { useSearchParams } from "react-router-dom";

// Both booking modals live in URL search params (see useKonzultaciaModal and
// useRezervaciaModal). Switching rewrites the params in one step — closing
// one modal and opening the other — so there's no flash of the page between
// them and the browser's Back button returns to where the visitor started.
// Keep these keys in sync with those two hooks.
const KONZULTACIA_KEYS = ["konzultacia", "vetva", "sposob", "balik"];
const REZERVACIA_KEYS = ["rezervacia", "kto"];

export function useModalSwitch() {
  const [, setSearchParams] = useSearchParams();

  function swap(remove: string[], openKey: string) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        remove.forEach((key) => next.delete(key));
        next.set(openKey, "1");
        return next;
      },
      { replace: true },
    );
  }

  return {
    /** consultation modal → presentation booking (schools, organisations) */
    toRezervacia: () => swap(KONZULTACIA_KEYS, "rezervacia"),
    /** presentation booking → consultation modal (own parrot) */
    toKonzultacia: () => swap(REZERVACIA_KEYS, "konzultacia"),
  };
}
