import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, cart, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          Velour
        </Link>

        <ul
          className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}
        >
          <li>
            <Link to="/" className={isActive("/") ? "active" : ""}>
              Collection
            </Link>
          </li>
          <li>
            <Link to="/#maison" className="">
              Maison
            </Link>
          </li>
          <li>
            <Link to="/#ingredients" className="">
              Ingrédients
            </Link>
          </li>
          {user && (
            <li>
              <Link
                to="/orders"
                className={isActive("/orders") ? "active" : ""}
              >
                Commandes
              </Link>
            </li>
          )}
        </ul>

        <div className="navbar__actions">
          {user ? (
            <>
              <span className="navbar__user">{user.firstName}</span>
              <Link to="/cart" className="navbar__cart">
                <svg
                  width="18"
                  height="18"
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
                  <span className="navbar__cart-count">{cartCount}</span>
                )}
              </Link>
              <button
                className="navbar__logout"
                onClick={() => {
                  logout();
                  navigate("/");
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
            <button className="navbar__btn" onClick={() => navigate("/login")}>
              Connexion
            </button>
          )}
        </div>

        <button
          className="navbar__burger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
