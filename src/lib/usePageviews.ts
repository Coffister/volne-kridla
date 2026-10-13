import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { initAnalytics, trackPageview } from "./analytics";

// how long to let the new page set its <title> (useDocumentMeta) and finish
// the route transition before reporting it — same delay Umami itself uses
const SETTLE_MS = 300;

/** Public site only: loads analytics and reports a page view per path. */
export function usePageviews() {
  const { pathname } = useLocation();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(trackPageview, SETTLE_MS);
    return () => window.clearTimeout(timer);
  }, [pathname]);
}
