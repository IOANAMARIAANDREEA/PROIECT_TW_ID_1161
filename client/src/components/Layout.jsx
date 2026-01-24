import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearAuth, getUser } from "../services/auth.js";

export default function Layout() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Document Classifier</h1>
          <p>Clasificare si numar de inregistrare pentru documente electronice</p>
        </div>
        <nav>
          <NavLink to="/documents">Documente</NavLink>
          <NavLink to="/dropbox">Dropbox</NavLink>
          <NavLink to="/categorii">Categorii</NavLink>
          <NavLink to="/tipuri">Tip document</NavLink>
          {user ? (
            <button type="button" onClick={handleLogout}>
              Log out{user?.name ? ` (${user.name})` : ""}
            </button>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
