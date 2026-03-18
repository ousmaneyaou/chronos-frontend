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

// Route protégée
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
        borderTop: "1px solid var(--gray-dim)",
        padding: "40px 24px",
        textAlign: "center",
        marginTop: "auto",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <span style={{ color: "var(--gold)", fontSize: "1rem" }}>◈</span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              letterSpacing: "6px",
              color: "var(--white)",
              textTransform: "uppercase",
            }}
          >
            CHRONOS
          </span>
        </div>
        <p style={{ fontSize: 11, color: "var(--gray)", letterSpacing: 1 }}>
          Haute Horlogerie · Paiements sécurisés par GIM Pay
        </p>
        <div
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {[
            "InitiateOrder ✓",
            "PayByCard 3DS ON ✓",
            "PayByCard 3DS OFF ✓",
            "Webhook ✓",
          ].map((item) => (
            <span
              key={item}
              style={{
                fontSize: 9,
                letterSpacing: 1.5,
                padding: "3px 10px",
                border: "1px solid var(--gray-dim)",
                borderRadius: 2,
                color: "var(--gray)",
                textTransform: "uppercase",
              }}
            >
              {item}
            </span>
          ))}
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
