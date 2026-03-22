import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { cartApi } from "../services/api";
import { useApp } from "../context/AppContext";
import { toast } from "react-toastify";
import "./CartPage.css";

export default function CartPage() {
  const { user, cart, cartTotal, loadCart } = useApp();
  const navigate = useNavigate();

  const formatPrice = (p) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(p || 0);

  const handleRemove = async (itemId) => {
    try {
      await cartApi.removeItem(itemId, user.id);
      await loadCart();
      toast.success("Produit retiré du panier");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleUpdateQty = async (itemId, qty) => {
    if (qty < 1) {
      handleRemove(itemId);
      return;
    }
    try {
      await cartApi.updateItem(itemId, user.id, { quantity: qty });
      await loadCart();
    } catch {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  if (!cart.length)
    return (
      <div className="cart">
        <div className="container">
          <div className="cart__header fade-up">
            <span className="section-label">Mon espace beauté</span>
            <h1 className="section-title">
              Mon <em>panier</em>
            </h1>
          </div>
          <div className="empty-state fade-up">
            <div className="empty-icon">◈</div>
            <h3>Votre panier est vide</h3>
            <p>
              Découvrez nos soins d'exception et commencez votre rituel AURUM.
            </p>
            <Link
              to="/"
              className="btn-primary"
              style={{ marginTop: 28, display: "inline-flex" }}
            >
              Découvrir la collection →
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="cart">
      <div className="container">
        <div className="cart__header fade-up">
          <span className="section-label">Mon espace beauté</span>
          <h1 className="section-title">
            Mon <em>panier</em>
          </h1>
        </div>

        <div className="cart__layout">
          {/* Liste des produits */}
          <div className="cart__items fade-up">
            {cart.map((item, i) => (
              <div
                key={item.id}
                className="cart__item"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="cart__item-img">
                  {item.watchImageUrl ? (
                    <img src={item.watchImageUrl} alt={item.watchName} />
                  ) : (
                    <div className="cart__item-placeholder">◈</div>
                  )}
                </div>
                <div className="cart__item-info">
                  <div className="cart__item-brand">{item.watchBrand}</div>
                  <div className="cart__item-name">{item.watchName}</div>
                  <div className="cart__item-price">
                    {formatPrice(item.unitPrice)}
                  </div>
                </div>
                <div className="cart__item-controls">
                  <div className="cart__qty">
                    <button
                      onClick={() =>
                        handleUpdateQty(item.id, item.quantity - 1)
                      }
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleUpdateQty(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <div className="cart__item-subtotal">
                    {formatPrice(item.subtotal)}
                  </div>
                  <button
                    className="cart__remove"
                    onClick={() => handleRemove(item.id)}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Résumé commande */}
          <div
            className="cart__summary fade-up"
            style={{ animationDelay: "0.15s" }}
          >
            <h3 className="cart__summary-title">Résumé</h3>
            <div className="divider-gold" style={{ margin: "16px 0" }} />

            <div className="cart__summary-rows">
              <div className="cart__summary-row">
                <span>Sous-total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="cart__summary-row">
                <span>Livraison</span>
                <span style={{ color: "rgba(200,169,110,.6)", fontSize: 11 }}>
                  Calculée à la commande
                </span>
              </div>
            </div>

            <div className="divider-gold" style={{ margin: "16px 0" }} />
            <div className="cart__summary-total">
              <span>Total estimé</span>
              <span className="price">{formatPrice(cartTotal)}</span>
            </div>

            <button
              className="btn-primary cart__checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Commander · {formatPrice(cartTotal)} →
            </button>

            <div className="cart__secure">
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
              Paiement sécurisé · GIM Pay · SSL
            </div>

            <Link to="/" className="cart__continue">
              ← Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
