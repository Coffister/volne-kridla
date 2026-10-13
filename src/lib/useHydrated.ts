import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** false on the server and during hydration of the prerendered HTML, true
 * right after. For UI the static HTML can't know about — e.g. a modal opened
 * by a "?konzultacia=1" link — so it appears after hydration instead of
 * breaking it (the server never sees the query string). */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
