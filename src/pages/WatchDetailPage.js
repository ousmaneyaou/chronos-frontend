import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { watchApi, cartApi } from "../services/api";
import { useApp } from "../context/AppContext";
import { toast } from "react-toastify";
import "./WatchDetailPage.css";

export default function WatchDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loadCart } = useApp();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    watchApi
      .getById(id)
      .then((r) => setProduct(r.data))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const formatPrice = (p) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(p || 0);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setAdding(true);
    try {
      await cartApi.addItem(user.id, { watchId: product.id, quantity: qty });
      await loadCart();
      toast.success(`✓ ${product.name} ajouté au panier`);
    } catch {
      toast.error("Erreur lors de l'ajout au panier");
    } finally {
      setAdding(false);
    }
  };

  if (loading)
    return (
      <div className="detail-loading">
        <div className="skeleton" style={{ height: "60vh" }} />
      </div>
    );

  if (!product) return null;

  const ingredients =
    product.description?.split(",").map((s) => s.trim()) || [];

  return (
    <div className="detail">
      <div className="detail__inner">
        {/* Image */}
        <div className="detail__media">
          <div className="detail__img-wrap">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} />
            ) : (
              <div className="detail__placeholder">◈</div>
            )}
          </div>
          <div className="detail__corner detail__corner--tl" />
          <div className="detail__corner detail__corner--br" />
        </div>

        {/* Infos */}
        <div className="detail__info fade-up">
          <div className="detail__category">{product.category?.name}</div>
          <div className="detail__brand">{product.brand}</div>
          <h1 className="detail__name">{product.name}</h1>
          <div className="divider-gold" />
          <p className="detail__desc">{product.description}</p>

          {/* Ingrédients */}
          {ingredients.length > 1 && (
            <div className="detail__ingredients">
              <div className="detail__ingredients-title">Ingrédients clés</div>
              <div className="detail__ingredients-list">
                {ingredients.map((ing, i) => (
                  <span key={i} className="detail__ingredient">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="detail__price">{formatPrice(product.price)}</div>

          {/* Stock */}
          <div className="detail__stock">
            {product.stock > 0 ? (
              <span className="detail__stock-ok">
                <span className="detail__stock-dot" /> En stock
                {product.stock <= 5 && ` · Plus que ${product.stock}`}
              </span>
            ) : (
              <span className="detail__stock-out">Épuisé</span>
            )}
          </div>

          {/* Quantité + Ajouter */}
          {product.stock > 0 && (
            <div className="detail__actions">
              <div className="detail__qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  −
                </button>
                <span>{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                >
                  +
                </button>
              </div>
              <button
                className="btn-primary detail__add"
                onClick={handleAddToCart}
                disabled={adding}
              >
                {adding ? <span className="spinner" /> : "Ajouter au panier →"}
              </button>
            </div>
          )}

          {/* Sécurité */}
          <div className="detail__secure">
            <div className="detail__secure-item">
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
              Paiement sécurisé GIM Pay
            </div>
            <div className="detail__secure-item">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              Livraison soignée
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
