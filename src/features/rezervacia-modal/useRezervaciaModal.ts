import { useSearchParams } from "react-router-dom";

import { useHydrated } from "@/lib/useHydrated";

import { INVITER_KINDS, type InviterKind } from "./data";

const PARAM_OPEN = "rezervacia";
const PARAM_KIND = "kto";

// Same URL-driven pattern as useKonzultaciaModal: "?rezervacia=1&kto=skola"
// opens the presentation booking modal on top of whatever route is showing,
// so any CTA (or a link sent to a school) can open it pre-filled.
export function useRezervaciaModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const hydrated = useHydrated();

  // not until hydration is done — see useHydrated
  const isOpen = hydrated && searchParams.get(PARAM_OPEN) === "1";
  const requestedKind = searchParams.get(PARAM_KIND);
  const kind: InviterKind | null = INVITER_KINDS.some((k) => k.id === requestedKind)
    ? (requestedKind as InviterKind)
    : null;

  function open(nextKind?: InviterKind) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set(PARAM_OPEN, "1");
      if (nextKind) next.set(PARAM_KIND, nextKind);
      return next;
    });
  }

  function close() {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete(PARAM_OPEN);
      next.delete(PARAM_KIND);
      return next;
    });
  }

  function setKind(nextKind: InviterKind) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set(PARAM_KIND, nextKind);
        return next;
      },
      { replace: true },
    );
  }

  return { isOpen, kind, open, close, setKind };
}
