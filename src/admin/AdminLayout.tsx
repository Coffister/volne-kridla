import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "./auth/AuthProvider";
import PublishButton from "./components/PublishButton";

export default function AdminLayout() {
  const { session, signOut } = useAuth();
  const [navOpen, setNavOpen] = useState(false);
  const closeNav = () => setNavOpen(false);

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar${navOpen ? " is-open" : ""}`}>
        <div className="admin-sidebar-head">
          <div className="admin-brand">Voľné krídla</div>
          <button
            type="button"
            className="admin-nav-toggle"
            aria-expanded={navOpen}
            aria-label="Prepnúť menu"
            onClick={() => setNavOpen((open) => !open)}
          >
            <span />
          </button>
        </div>
        <div className="admin-sidebar-body">
          <nav>
            <NavLink to="/admin" end onClick={closeNav}>
              Prehľad
            </NavLink>
            <hr className="admin-divider" />
            <NavLink to="/admin/fotogaleria" onClick={closeNav}>
              Fotogaléria
            </NavLink>
            <NavLink to="/admin/recenzie" onClick={closeNav}>
              Recenzie
            </NavLink>
            <NavLink to="/admin/otazky" onClick={closeNav}>
              Otázky
            </NavLink>
            <hr className="admin-divider" />
            <NavLink to="/admin/produkty" onClick={closeNav}>
              Produkty
            </NavLink>
            <NavLink to="/admin/objednavky" onClick={closeNav}>
              Objednávky
            </NavLink>
            <hr className="admin-divider" />
            <NavLink to="/admin/verzie" onClick={closeNav}>
              Verzie
            </NavLink>
          </nav>
          <hr className="admin-divider" />
          <div className="admin-user">
            <span>{session?.user.email}</span>
            <button type="button" onClick={() => signOut()}>
              Odhlásiť sa
            </button>
          </div>
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
