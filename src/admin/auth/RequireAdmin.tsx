import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "./AuthProvider";

/** Gate for every /admin route except the login page. */
export default function RequireAdmin({ children }: { children: ReactNode }) {
  const { loading, session, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="admin-splash">Načítavam…</div>;
  }

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return (
      <div className="admin-splash">
        <p>Tento účet nemá oprávnenie na správu obsahu.</p>
      </div>
    );
  }

  return <>{children}</>;
}
