import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import WatchDetailPage from "./pages/WatchDetailPage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";

function ProtectedRoute({ children }) {
  const { user } = useApp();
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/watch/:id" element={<WatchDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}

function Footer() {
  return (
    <footer
      style={{
        background: "var(--charcoal)",
        borderTop: "0.5px solid rgba(200,196,190,0.12)",
        padding: "60px 60px 40px",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 60,
            marginBottom: 60,
          }}
        >
          {/* Brand */}
          <div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 24,
                fontWeight: 300,
                letterSpacing: 8,
                textTransform: "uppercase",
                color: "var(--white)",
                display: "block",
                marginBottom: 20,
              }}
            >
              Velour
            </span>
            <p
              style={{
                fontSize: 11,
                fontWeight: 300,
                color: "var(--silver)",
                lineHeight: 2.2,
                maxWidth: 240,
              }}
            >
              Haute Parfumerie d'exception. Créée avec passion, portée avec
              élégance.
            </p>
          </div>

          {/* Liens */}
          {[
            {
              title: "Collections",
              links: ["Femme", "Homme", "Unisexe", "Éditions limitées"],
            },
            {
              title: "Maison",
              links: [
                "Notre histoire",
                "Savoir-faire",
                "Ingrédients",
                "Atelier",
              ],
            },
            {
              title: "Service",
              links: ["Livraison", "Retours", "Contact", "FAQ"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4
                style={{
                  fontSize: 9,
                  fontWeight: 300,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  color: "var(--silver)",
                  marginBottom: 20,
                }}
              >
                {col.title}
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      style={{
                        fontSize: 11,
                        fontWeight: 300,
                        letterSpacing: 1,
                        color: "rgba(200,196,190,0.55)",
                        transition: "color 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.color = "var(--white)")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.color = "rgba(200,196,190,0.55)")
                      }
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "0.5px solid rgba(200,196,190,0.12)",
            paddingTop: 28,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 300,
              color: "rgba(200,196,190,0.35)",
              letterSpacing: 2,
            }}
          >
            © 2025 Velour · Haute Parfumerie
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {["Parfums ✓", "3DS ON ✓", "3DS OFF ✓", "GIM Pay ✓"].map((item) => (
              <span
                key={item}
                style={{
                  fontSize: 8,
                  letterSpacing: 2,
                  padding: "3px 10px",
                  border: "0.5px solid rgba(200,196,190,0.15)",
                  color: "rgba(200,196,190,0.35)",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
