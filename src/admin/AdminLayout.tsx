import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "./auth/AuthProvider";
import PublishButton from "./components/PublishButton";

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
          <NavLink to="/admin/recenzie">Recenzie</NavLink>
          <NavLink to="/admin/verzie">Verzie</NavLink>
        </nav>
        <div className="admin-user">
          <span>{session?.user.email}</span>
          <button type="button" onClick={() => signOut()}>
            Odhlásiť sa
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar">
          <PublishButton />
        </header>
        <div className="admin-view">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
