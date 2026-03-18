import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout, cartCount } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">◈</span>
          <span className="navbar__logo-text">WATCHSTORE</span>
        </Link>

        {/* Nav links */}
        <ul
          className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}
        >
          <li>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              Collection
            </Link>
          </li>
          {user && (
            <>
              <li>
                <Link
                  to="/cart"
                  className={location.pathname === "/cart" ? "active" : ""}
                >
                  Panier
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className={location.pathname === "/orders" ? "active" : ""}
                >
                  Commandes
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Actions */}
        <div className="navbar__actions">
          {user ? (
            <>
              <Link to="/cart" className="navbar__cart">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span className="navbar__cart-badge">{cartCount}</span>
                )}
              </Link>
              <div className="navbar__user">
                <span className="navbar__user-name">{user.firstName}</span>
                <button onClick={handleLogout} className="navbar__logout">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="btn-outline"
              style={{ padding: "8px 20px", fontSize: "10px" }}
            >
              Connexion
            </Link>
          )}
          <button
            className="navbar__burger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Gold line */}
      <div className="navbar__line" />
    </nav>
  );
}
