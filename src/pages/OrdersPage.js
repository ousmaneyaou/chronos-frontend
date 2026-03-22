import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { orderApi } from "../services/api";
import { useApp } from "../context/AppContext";
import "./OrdersPage.css";

const STATUS_MAP = {
  PENDING: { label: "En attente", cls: "badge-gray" },
  PAYMENT_INITIATED: { label: "Paiement initié", cls: "badge-gold" },
  PAID: { label: "Payée", cls: "badge-green" },
  PROCESSING: { label: "En traitement", cls: "badge-gold" },
  SHIPPED: { label: "Expédiée", cls: "badge-gold" },
  DELIVERED: { label: "Livrée", cls: "badge-green" },
  CANCELLED: { label: "Annulée", cls: "badge-red" },
  FAILED: { label: "Échouée", cls: "badge-red" },
};

const getPaymentLabel = (payment) => {
  if (!payment) return null;
  if (payment.actionCode === "909")
    return { label: "Traitée (test)", cls: "badge-gold" };
  const map = {
    INITIATED: { label: "Initiée", cls: "badge-gray" },
    PENDING: { label: "En cours", cls: "badge-gold" },
    SUCCESS: { label: "Succès", cls: "badge-green" },
    FAILED: { label: "Échouée", cls: "badge-red" },
    REFUNDED: { label: "Remboursée", cls: "badge-gray" },
  };
  return map[payment.status] || { label: payment.status, cls: "badge-gray" };
};

const isPaidOrSuccess = (order) =>
  order.status === "PAID" || order.payment?.status === "SUCCESS";

export default function OrdersPage() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    orderApi
      .getByUser(user.id)
      .then((r) => setOrders(r.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const formatPrice = (p) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(p || 0);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading)
    return (
      <div className="orders container">
        <div className="orders__header fade-up">
          <span className="section-label">Votre historique</span>
          <h1 className="section-title">Mes commandes</h1>
        </div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: 80, marginBottom: 8, borderRadius: 2 }}
          />
        ))}
      </div>
    );

  return (
    <div className="orders">
      <div className="container">
        <div className="orders__header fade-up">
          <span className="section-label">Votre historique</span>
          <h1 className="section-title">Mes commandes</h1>
          <p className="orders__count">
            {orders.length} commande{orders.length > 1 ? "s" : ""}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state fade-up">
            <div className="empty-icon">◈</div>
            <h3>Aucune commande</h3>
            <p>Vous n'avez pas encore passé de commande.</p>
            <Link
              to="/"
              className="btn-primary"
              style={{ marginTop: 24, display: "inline-flex" }}
            >
              Découvrir la collection
            </Link>
          </div>
        ) : (
          <div className="orders__list fade-up">
            {orders.map((order, i) => {
              const status = STATUS_MAP[order.status] || {
                label: order.status,
                cls: "badge-gray",
              };
              const payLabel = getPaymentLabel(order.payment);
              const isOpen = expanded === order.id;
              const is909 = order.payment?.actionCode === "909";
              const show3dsButton =
                order.payment?.challengeRequired &&
                order.payment?.threeDsUrl &&
                !isPaidOrSuccess(order);

              return (
                <div
                  key={order.id}
                  className={`orders__item ${isOpen ? "orders__item--open" : ""}`}
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <div
                    className="orders__item-header"
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                  >
                    <div className="orders__item-left">
                      <div className="orders__item-id">
                        <span className="orders__item-label">Commande</span>
                        <span className="orders__item-num">#{order.id}</span>
                      </div>
                      <div className="orders__item-date">
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <div className="orders__item-center">
                      {is909 ? (
                        <span className="badge badge-gold">Traitée</span>
                      ) : (
                        <span className={`badge ${status.cls}`}>
                          {status.label}
                        </span>
                      )}
                      {payLabel && (
                        <span className={`badge ${payLabel.cls}`}>
                          {payLabel.label}
                        </span>
                      )}
                    </div>
                    <div className="orders__item-right">
                      <span className="price-small">
                        {formatPrice(order.totalAmount)}
                      </span>
                      <svg
                        className={`orders__item-chevron ${isOpen ? "orders__item-chevron--open" : ""}`}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="orders__item-body fade-in">
                      <div className="orders__item-grid">
                        {/* Articles */}
                        <div className="orders__detail-section">
                          <h4 className="orders__detail-title">Produits</h4>
                          {order.items?.length > 0 ? (
                            order.items.map((item) => (
                              <div key={item.id} className="orders__article">
                                <div>
                                  <span className="orders__article-brand">
                                    {item.watchBrand}
                                  </span>
                                  <div className="orders__article-name">
                                    {item.watchName}
                                  </div>
                                  <div className="orders__article-qty">
                                    Qté : {item.quantity}
                                  </div>
                                </div>
                                <span className="orders__article-price">
                                  {formatPrice(item.subtotal)}
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="orders__empty-items">
                              Produits non disponibles
                            </p>
                          )}
                        </div>

                        {/* Livraison */}
                        <div className="orders__detail-section">
                          <h4 className="orders__detail-title">Livraison</h4>
                          <div className="orders__info-row">
                            <span>Adresse</span>
                            <span>{order.shippingAddress || "—"}</span>
                          </div>
                          <div className="orders__info-row">
                            <span>Total</span>
                            <span className="price-small">
                              {formatPrice(order.totalAmount)}
                            </span>
                          </div>
                        </div>

                        {/* GIM Pay */}
                        {(order.gimPayOrderId || order.gimPayOrderUrl) && (
                          <div className="orders__detail-section">
                            <h4 className="orders__detail-title">GIM Pay</h4>
                            {order.gimPayOrderId && (
                              <div className="orders__info-row">
                                <span>Order ID</span>
                                <span className="orders__ref">
                                  {order.gimPayOrderId}
                                </span>
                              </div>
                            )}
                            {order.gimPayOrderRefId && (
                              <div className="orders__info-row">
                                <span>Référence</span>
                                <span className="orders__ref">
                                  {order.gimPayOrderRefId}
                                </span>
                              </div>
                            )}
                            {order.gimPayOrderUrl && (
                              <a
                                href={order.gimPayOrderUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="btn-outline orders__paylink-btn"
                              >
                                Ouvrir le lien de paiement →
                              </a>
                            )}
                          </div>
                        )}

                        {/* Paiement */}
                        {order.payment && (
                          <div className="orders__detail-section">
                            <h4 className="orders__detail-title">Paiement</h4>
                            <div className="orders__info-row">
                              <span>Méthode</span>
                              <span>
                                {order.payment.method === "CARD_3DS_ON"
                                  ? "Carte 3DS"
                                  : order.payment.method === "CARD_3DS_OFF"
                                    ? "Carte directe"
                                    : "—"}
                              </span>
                            </div>
                            {order.payment.actionCode && (
                              <div className="orders__info-row">
                                <span>Code action</span>
                                <span
                                  className={
                                    order.payment.actionCode === "909"
                                      ? "orders__ref"
                                      : ""
                                  }
                                >
                                  {order.payment.actionCode}
                                  {order.payment.actionCode === "909" && (
                                    <span className="orders__code-note">
                                      {" "}
                                      — carte test UAT
                                    </span>
                                  )}
                                </span>
                              </div>
                            )}
                            {order.payment.systemReference &&
                              order.payment.systemReference !== "0" && (
                                <div className="orders__info-row">
                                  <span>Référence système</span>
                                  <span className="orders__ref">
                                    {order.payment.systemReference}
                                  </span>
                                </div>
                              )}
                            {show3dsButton && (
                              <div className="orders__3ds-section">
                                <div className="orders__3ds-badge">
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
                                  Authentification 3D Secure en attente
                                </div>
                                <a
                                  href={order.payment.threeDsUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn-primary orders__3ds-btn"
                                >
                                  Reprendre l'authentification 3DS →
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
