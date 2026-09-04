import { useSearchParams } from "react-router-dom";

import { TRACKS, type TrackId } from "./data";

const PARAM_OPEN = "konzultacia";
const PARAM_TRACK = "vetva";

// Modal open/closed state and the requested track live entirely in the URL
// search params, so any page CTA (or a shared link) can open the modal by
// just navigating to "?konzultacia=1&vetva=kurz" on top of whatever route
// the visitor is already on.
export function useKonzultaciaModal() {
  const [searchParams, setSearchParams] = useSearchParams();

  const isOpen = searchParams.get(PARAM_OPEN) === "1";
  const requestedTrack = searchParams.get(PARAM_TRACK);
  const track: TrackId = TRACKS.some((t) => t.id === requestedTrack)
    ? (requestedTrack as TrackId)
    : "konzultacia";

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
      return next;
    });
  }

  return { isOpen, track, open, close };
}
