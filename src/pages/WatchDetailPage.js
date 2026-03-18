import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { watchApi } from "../services/api";
import { useApp } from "../context/AppContext";
import "./WatchDetailPage.css";

export default function WatchDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, user } = useApp();
  const [watch, setWatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    watchApi
      .getById(id)
      .then((r) => setWatch(r.data))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const formatPrice = (p) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(p);

  const handleAdd = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setAdding(true);
    await addToCart(watch.id, quantity);
    setAdding(false);
  };

  if (loading)
    return (
      <div className="detail-loading container">
        <div className="skeleton" style={{ height: 500, marginBottom: 24 }} />
        <div
          className="skeleton"
          style={{ height: 32, width: "50%", marginBottom: 16 }}
        />
        <div className="skeleton" style={{ height: 20, width: "30%" }} />
      </div>
    );

  if (!watch) return null;

  const specs = [
    { label: "Référence", value: watch.reference },
    { label: "Matériau", value: watch.material },
    { label: "Mouvement", value: watch.movement },
    { label: "Résistance à l'eau", value: watch.waterResistance },
    { label: "Catégorie", value: watch.categoryName },
  ].filter((s) => s.value);

  return (
    <div className="detail">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="detail__breadcrumb fade-in">
          <button onClick={() => navigate("/")} className="btn-ghost">
            ← Collection
          </button>
          <span className="detail__breadcrumb-sep">/</span>
          <span>{watch.brand}</span>
        </nav>

        <div className="detail__grid">
          {/* Image */}
          <div className="detail__image-wrap fade-in">
            {!imgError ? (
              <img
                src={watch.imageUrl}
                alt={watch.name}
                onError={() => setImgError(true)}
                className="detail__image"
              />
            ) : (
              <div className="detail__image-placeholder">◈</div>
            )}
            {/* Floating label */}
            <div className="detail__image-label">
              <span>{watch.brand}</span>
            </div>
          </div>

          {/* Info */}
          <div className="detail__info fade-up">
            <span className="detail__brand">{watch.brand}</span>
            <h1 className="detail__name">{watch.name}</h1>

            <div className="divider-gold" style={{ margin: "24px 0" }} />

            <div className="detail__price">{formatPrice(watch.price)}</div>

            {watch.description && (
              <p className="detail__description">{watch.description}</p>
            )}

            {/* Specs */}
            {specs.length > 0 && (
              <div className="detail__specs">
                {specs.map((s) => (
                  <div key={s.label} className="detail__spec">
                    <span className="detail__spec-label">{s.label}</span>
                    <span className="detail__spec-value">{s.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Stock */}
            <div className="detail__stock">
              {watch.stock > 5 ? (
                <span className="badge badge-green">En stock</span>
              ) : watch.stock > 0 ? (
                <span className="badge badge-gold">
                  Plus que {watch.stock} en stock
                </span>
              ) : (
                <span className="badge badge-red">Épuisé</span>
              )}
            </div>

            {/* Quantity + Add */}
            {watch.stock > 0 && (
              <div className="detail__actions">
                <div className="detail__qty">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    −
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(watch.stock, q + 1))
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  className="btn-primary detail__add-btn"
                  onClick={handleAdd}
                  disabled={adding}
                >
                  {adding ? (
                    <span className="spinner" />
                  ) : (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 01-8 0" />
                      </svg>
                      Ajouter au panier
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Secure payment note */}
            <div className="detail__secure">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Paiement sécurisé · GIM Pay · 3D Secure disponible</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
