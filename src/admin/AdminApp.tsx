import { Route, Routes } from "react-router-dom";

import { isSupabaseConfigured } from "@/lib/supabase";
import { AuthProvider } from "./auth/AuthProvider";
import RequireAdmin from "./auth/RequireAdmin";
import AdminLayout from "./AdminLayout";
import LoginPage from "./routes/LoginPage";
import OverviewPage from "./routes/OverviewPage";
import GalleryPage from "./routes/GalleryPage";
import ReviewsPage from "./routes/ReviewsPage";
import FaqPage from "./routes/FaqPage";
import VersionsPage from "./routes/VersionsPage";

import "./admin.css";

/** Mounted lazily at /admin/* — not part of the public bundle. */
export default function AdminApp() {
  if (!isSupabaseConfigured) {
    return (
      <div className="admin-splash">
        <div className="admin-card">
          <h1>Admin nie je nakonfigurovaný</h1>
          <p>
            Chýbajú premenné <code>VITE_SUPABASE_URL</code> a{" "}
            <code>VITE_SUPABASE_ANON_KEY</code>. Doplň ich do <code>.env.local</code>{" "}
            (lokálne) a do nastavení projektu vo Verceli.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="fotogaleria" element={<GalleryPage />} />
          <Route path="recenzie" element={<ReviewsPage />} />
          <Route path="otazky" element={<FaqPage />} />
          <Route path="verzie" element={<VersionsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
