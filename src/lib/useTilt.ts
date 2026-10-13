import { useId } from "react";

/** A small, random-looking tilt (-2deg … 2deg) that stays the same on the
 * server and in the browser — derived from the component's useId instead of
 * Math.random(), which would differ between the prerendered HTML and
 * hydration. */
export function useTilt(): string {
  const id = useId();
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  const unit = ((hash >>> 0) % 1000) / 1000;
  return `${(unit * 4 - 2).toFixed(2)}deg`;
}
