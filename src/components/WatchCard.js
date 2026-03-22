import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { cartApi } from "../services/api";
import { toast } from "react-toastify";
import "./WatchCard.css";

export default function WatchCard({ watch }) {
  const { user, loadCart } = useApp();
  const navigate = useNavigate();

  const formatPrice = (p) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(p || 0);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await cartApi.addItem(user.id, { watchId: watch.id, quantity: 1 });
      await loadCart();
      toast.success(`✓ ${watch.name} ajouté au panier`);
    } catch {
      toast.error("Erreur lors de l'ajout au panier");
    }
  };

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/watch/${watch.id}`)}
    >
      <div className="product-card__img">
        {watch.imageUrl ? (
          <img src={watch.imageUrl} alt={watch.name} loading="lazy" />
        ) : (
          <div className="product-card__placeholder">
            <span>◈</span>
          </div>
        )}
        <div className="product-card__overlay" />

        {/* Badge catégorie */}
        <div className="product-card__category">{watch.category?.name}</div>

        {/* Stock faible */}
        {watch.stock <= 5 && watch.stock > 0 && (
          <div className="product-card__stock-badge">
            Plus que {watch.stock}
          </div>
        )}
        {watch.stock === 0 && (
          <div className="product-card__stock-badge product-card__stock-badge--out">
            Épuisé
          </div>
        )}
      </div>

      <div className="product-card__body">
        <div className="product-card__brand">{watch.brand}</div>
        <h3 className="product-card__name">{watch.name}</h3>
        <p className="product-card__desc">{watch.description}</p>

        <div className="product-card__footer">
          <span className="price-small">{formatPrice(watch.price)}</span>
          <button
            className="product-card__add"
            onClick={handleAddToCart}
            disabled={watch.stock === 0}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="4" x2="12" y2="20" />
              <line x1="4" y1="12" x2="20" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
