import { useEffect, useRef } from "react";

import { takeOpenSource, trackEvent } from "./analytics";

/** Funnel events for a multi-step booking form: "<form>-otvorenie" (with
 * where it was opened from) and "<form>-krok-2" / "-krok-3" the first time
 * the visitor gets that far in this opening — going back and forth between
 * steps doesn't count twice. Submission and errors are reported by the form
 * itself ("<form>-odoslanie", "<form>-chyba"). Step 4 is the success screen. */
export function useFormFunnel(form: string, isOpen: boolean, step: number) {
  const furthest = useRef(1);

  useEffect(() => {
    if (!isOpen) return;
    furthest.current = 1;
    trackEvent(`${form}-otvorenie`, { zdroj: takeOpenSource() });
  }, [form, isOpen]);

  useEffect(() => {
    if (!isOpen || step >= 4 || step <= furthest.current) return;
    furthest.current = step;
    trackEvent(`${form}-krok-${step}`);
  }, [form, isOpen, step]);
}
