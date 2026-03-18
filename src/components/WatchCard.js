import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "./WatchCard.css";

export default function WatchCard({ watch }) {
  const { addToCart, user } = useApp();
  const [adding, setAdding] = useState(false);
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  const handleAdd = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    setAdding(true);
    await addToCart(watch.id, 1);
    setAdding(false);
  };

  const formatPrice = (p) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(p);

  return (
    <div className="watch-card" onClick={() => navigate(`/watch/${watch.id}`)}>
      {/* Image */}
      <div className="watch-card__image-wrap">
        {!imgError ? (
          <img
            src={
              watch.imageUrl ||
              `https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400`
            }
            alt={watch.name}
            onError={() => setImgError(true)}
            className="watch-card__image"
          />
        ) : (
          <div className="watch-card__image-placeholder">
            <span>◈</span>
          </div>
        )}
        {/* Overlay */}
        <div className="watch-card__overlay">
          <button
            className="watch-card__overlay-btn"
            onClick={handleAdd}
            disabled={adding || watch.stock === 0}
          >
            {adding ? (
              <span className="spinner" />
            ) : watch.stock === 0 ? (
              "Épuisé"
            ) : (
              "Ajouter au panier"
            )}
          </button>
        </div>
        {/* Stock badge */}
        {watch.stock <= 3 && watch.stock > 0 && (
          <span className="watch-card__stock-badge">
            Plus que {watch.stock}
          </span>
        )}
        {watch.stock === 0 && (
          <span className="watch-card__stock-badge watch-card__stock-badge--empty">
            Épuisé
          </span>
        )}
      </div>

      {/* Info */}
      <div className="watch-card__info">
        <div className="watch-card__brand">{watch.brand}</div>
        <h3 className="watch-card__name">{watch.name}</h3>
        <div className="watch-card__footer">
          <span className="price-small">{formatPrice(watch.price)}</span>
          {watch.categoryName && (
            <span className="badge badge-gray">{watch.categoryName}</span>
          )}
        </div>
      </div>
    </div>
  );
}
