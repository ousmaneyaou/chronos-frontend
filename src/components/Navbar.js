import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout, cartCount } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-symbol">◈</span>
          <span className="navbar__logo-text">AURUM</span>
        </Link>

        {/* Links desktop */}
        <ul className="navbar__links">
          <li>
            <Link
              to="/"
              className={`navbar__link ${isActive("/") ? "navbar__link--active" : ""}`}
            >
              Collection
            </Link>
          </li>
          {user && (
            <>
              <li>
                <Link
                  to="/cart"
                  className={`navbar__link ${isActive("/cart") ? "navbar__link--active" : ""}`}
                >
                  Panier
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className={`navbar__link ${isActive("/orders") ? "navbar__link--active" : ""}`}
                >
                  Commandes
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Right actions */}
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
              <span className="navbar__user">{user.firstName}</span>
              <button
                className="navbar__logout"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </>
          ) : (
            <button
              className="btn-outline navbar__signin"
              onClick={() => navigate("/login")}
            >
              Connexion
            </button>
          )}

          {/* Burger mobile */}
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

      {/* Menu mobile */}
      {menuOpen && (
        <div className="navbar__mobile">
          <Link to="/">Collection</Link>
          {user && (
            <Link to="/cart">Panier {cartCount > 0 && `(${cartCount})`}</Link>
          )}
          {user && <Link to="/orders">Commandes</Link>}
          {user ? (
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Déconnexion
            </button>
          ) : (
            <button onClick={() => navigate("/login")}>Connexion</button>
          )}
        </div>
      )}
    </nav>
  );
}
