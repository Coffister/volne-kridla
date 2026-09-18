import { useSearchParams } from "react-router-dom";

import { TRACKS, type TrackId } from "./data";

const PARAM_OPEN = "konzultacia";
const PARAM_TRACK = "vetva";
const PARAM_TYPE = "sposob";
const PARAM_PACKAGE = "balik";

// Modal open/closed state and the requested track/type/package live
// entirely in the URL search params, so any page CTA — or a link a client
// copies after picking her options — can open the modal pre-filled by just
// navigating to "?konzultacia=1&vetva=konzultacia&sposob=online&balik=basic"
// on top of whatever route the visitor is already on.
export function useKonzultaciaModal() {
  const [searchParams, setSearchParams] = useSearchParams();

  const isOpen = searchParams.get(PARAM_OPEN) === "1";
  const requestedTrack = searchParams.get(PARAM_TRACK);
  // null when the link/CTA didn't ask for a specific track — the modal then
  // opens with neither pill pre-selected, rather than defaulting to one
  const track: TrackId | null = TRACKS.some((t) => t.id === requestedTrack)
    ? (requestedTrack as TrackId)
    : null;
  const requestedType = searchParams.get(PARAM_TYPE);
  const requestedPackage = searchParams.get(PARAM_PACKAGE);

  function open(nextTrack?: TrackId) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set(PARAM_OPEN, "1");
      if (nextTrack) next.set(PARAM_TRACK, nextTrack);
      return next;
    });
  }

  function close() {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete(PARAM_OPEN);
      next.delete(PARAM_TRACK);
      next.delete(PARAM_TYPE);
      next.delete(PARAM_PACKAGE);
      return next;
    });
  }

  // keeps the URL mirroring the visitor's current picks in step 1, so the
  // page's own address bar is always a valid, copyable "resume here" link
  function setSelection(patch: {
    track?: TrackId | null;
    type?: string | null;
    package?: string | null;
  }) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        const setOrDelete = (key: string, value: string | null | undefined) => {
          if (value === undefined) return;
          if (value === null) next.delete(key);
          else next.set(key, value);
        };
        setOrDelete(PARAM_TRACK, patch.track);
        setOrDelete(PARAM_TYPE, patch.type);
        setOrDelete(PARAM_PACKAGE, patch.package);
        return next;
      },
      { replace: true },
    );
  }

  return {
    isOpen,
    track,
    requestedType,
    requestedPackage,
    open,
    close,
    setSelection,
  };
}
