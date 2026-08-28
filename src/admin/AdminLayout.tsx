import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "./auth/AuthProvider";

export default function AdminLayout() {
  const { session, signOut } = useAuth();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">Voľné krídla</div>
        <nav>
          <NavLink to="/admin" end>
            Prehľad
          </NavLink>
          <NavLink to="/admin/fotogaleria">Fotogaléria</NavLink>
          <NavLink to="/admin/texty">Texty sekcií</NavLink>
        </nav>
        <div className="admin-user">
          <span>{session?.user.email}</span>
          <button type="button" onClick={() => signOut()}>
            Odhlásiť sa
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
