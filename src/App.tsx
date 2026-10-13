import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useSearchParams,
} from "react-router-dom";

import SiteLayout from "./layouts/SiteLayout";
import Home from "./pages/Home";
import VolneKridla from "./pages/VolneKridla";
import OMne from "./pages/OMne";
import Fotogaleria from "./pages/Fotogaleria";
import FotogaleriaAlbum from "./pages/FotogaleriaAlbum";
import Eshop from "./pages/Eshop";
import PreSkoly from "./pages/PreSkoly";
import Playground from "./pages/Playground";
import Cursor from "./ui/effects/Cursor";
import { KonzultaciaModal } from "./features/konzultacia-modal";
import { RezervaciaModal } from "./features/rezervacia-modal";
import NotFound from "./pages/NotFound";

// "/konzultacia" (and "?vetva=...") used to be a standalone page; it's now a
// modal opened from any route via "?konzultacia=1&vetva=...". Old/shared
// links still work: they land here and get redirected to the same modal
// state on top of the home page.
function KonzultaciaRedirect() {
  const [params] = useSearchParams();
  const vetva = params.get("vetva");
  return (
    <Navigate to={`/?konzultacia=1${vetva ? `&vetva=${vetva}` : ""}`} replace />
  );
}

// Admin is code-split: none of it (nor @supabase/supabase-js) ships in the
// public bundle. Loaded only when someone hits /admin/*.
const AdminApp = lazy(() => import("./admin/AdminApp"));

function SiteApp() {
  return (
    <>
      <Cursor />
      <KonzultaciaModal />
      <RezervaciaModal />
      <Routes>
        {/* standalone — not wrapped in the site chrome (navbar/footer) */}
        <Route path="/playground" element={<Playground />} />
        <Route path="/konzultacia" element={<KonzultaciaRedirect />} />

        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/volne-kridla" element={<VolneKridla />} />
          <Route path="/o-mne" element={<OMne />} />
          <Route path="/pre-skoly" element={<PreSkoly />} />
          <Route path="/fotogaleria" element={<Fotogaleria />} />
          <Route path="/fotogaleria/:slug" element={<FotogaleriaAlbum />} />
          <Route path="/eshop" element={<Eshop />} />
          <Route path="/eshop/produkt/:productId" element={<Eshop />} />
          <Route path="/eshop/checkout" element={<Navigate to="/eshop" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

// Router-agnostic route tree — wrapped in <BrowserRouter> in the browser and
// in <StaticRouter> by the build-time prerender (src/entry-server.tsx).
export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={null}>
            <AdminApp />
          </Suspense>
        }
      />
      <Route path="/*" element={<SiteApp />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
