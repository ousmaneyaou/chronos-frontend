import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "./CartPage.css";

export default function CartPage() {
  const { cart, cartTotal, cartLoading, updateCartItem, removeFromCart, user } =
    useApp();
  const navigate = useNavigate();

  const formatPrice = (p) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(p);

  if (cartLoading)
    return (
      <div className="cart container">
        <div className="cart__header fade-up">
          <span className="section-label">Votre sélection</span>
          <h1 className="section-title">Panier</h1>
        </div>
        {[1, 2].map((i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: 120, marginBottom: 12, borderRadius: 2 }}
          />
        ))}
      </div>
    );

  if (!cart.length)
    return (
      <div className="cart container fade-up">
        <div className="cart__header">
          <span className="section-label">Votre sélection</span>
          <h1 className="section-title">Panier</h1>
        </div>
        <div className="empty-state" style={{ paddingTop: 60 }}>
          <div className="empty-icon">◈</div>
          <h3>Votre panier est vide</h3>
          <p>Découvrez notre collection et ajoutez vos montres préférées.</p>
          <Link
            to="/"
            className="btn-primary"
            style={{ marginTop: 28, display: "inline-flex" }}
          >
            Explorer la collection
          </Link>
        </div>
      </div>
    );

  return (
    <div className="cart">
      <div className="container">
        <div className="cart__header fade-up">
          <span className="section-label">Votre sélection</span>
          <h1 className="section-title">Panier</h1>
          <p className="cart__count">
            {cart.length} article{cart.length > 1 ? "s" : ""}
          </p>
        </div>

        <div className="cart__layout">
          {/* Items */}
          <div className="cart__items">
            {cart.map((item, i) => (
              <div
                key={item.id}
                className="cart__item fade-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {/* Image */}
                <div className="cart__item-image">
                  <img
                    src={
                      item.watchImage ||
                      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200"
                    }
                    alt={item.watchName}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>

                {/* Details */}
                <div className="cart__item-details">
                  <div>
                    <span className="cart__item-brand">{item.watchBrand}</span>
                    <h3 className="cart__item-name">{item.watchName}</h3>
                    <span className="cart__item-unit">
                      {formatPrice(item.unitPrice)} / pièce
                    </span>
                  </div>
                </div>

                {/* Qty controls */}
                <div className="cart__item-controls">
                  <div className="cart__qty">
                    <button
                      onClick={() => updateCartItem(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateCartItem(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="cart__item-subtotal">
                    {formatPrice(item.subtotal)}
                  </span>
                </div>

                {/* Remove */}
                <button
                  className="cart__item-remove"
                  onClick={() => removeFromCart(item.id)}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div
            className="cart__summary fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            <h3 className="cart__summary-title">Récapitulatif</h3>

            <div className="divider-gold" style={{ margin: "16px 0" }} />

            <div className="cart__summary-rows">
              {cart.map((item) => (
                <div key={item.id} className="cart__summary-row">
                  <span>
                    {item.watchName} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.subtotal)}</span>
                </div>
              ))}
            </div>

            <div className="divider-gold" style={{ margin: "16px 0" }} />

            <div className="cart__summary-total">
              <span>Total</span>
              <span className="price">{formatPrice(cartTotal)}</span>
            </div>

            <div className="cart__summary-note">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Paiement sécurisé GIM Pay
            </div>

            <button
              className="btn-primary cart__checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Procéder au paiement
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>

            <Link
              to="/"
              className="btn-ghost"
              style={{ justifyContent: "center", marginTop: 12 }}
            >
              ← Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
