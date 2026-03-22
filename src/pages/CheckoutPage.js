import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderApi, paymentApi } from "../services/api";
import { useApp } from "../context/AppContext";
import { toast } from "react-toastify";
import "./CheckoutPage.css";

const STEPS = ["Livraison", "Paiement", "Confirmation"];

// ← CORRIGÉ : dynamique selon l'environnement
// En local      : http://localhost:3000/payment/result
// En production : https://ton-site.vercel.app/payment/result
const RETURN_URL =
  (process.env.REACT_APP_FRONTEND_URL || "http://localhost:3000") +
  "/payment/result";

export default function CheckoutPage() {
  const { user, cart, cartTotal, loadCart } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [threeDsOpen, setThreeDsOpen] = useState(false);
  const [shipping, setShipping] = useState({ address: user?.address || "" });
  const [payment, setPayment] = useState({
    pan: "",
    dateExpiration: "",
    cvv2: "",
    disable3ds: false,
  });

  const formatPrice = (p) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(p || 0);

  if (!user) {
    navigate("/login");
    return null;
  }
  if (!cart.length && !order) {
    navigate("/cart");
    return null;
  }

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!shipping.address) {
      toast.error("Adresse requise");
      return;
    }
    setLoading(true);
    try {
      const res = await orderApi.createOrder({
        userId: user.id,
        shippingAddress: shipping.address,
      });
      setOrder(res.data);
      setStep(1);
      if (res.data.gimPayOrderUrl) {
        toast.success("✓ Commande créée — lien GIM Pay généré");
      } else {
        toast.info("Commande créée");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!payment.pan || !payment.dateExpiration || !payment.cvv2) {
      toast.error("Tous les champs de carte sont requis");
      return;
    }
    setLoading(true);
    try {
      const res = await paymentApi.payByCard({
        orderId: order.id,
        pan: payment.pan.replace(/\s/g, ""),
        dateExpiration: payment.dateExpiration.replace("/", ""),
        cvv2: payment.cvv2,
        disable3ds: payment.disable3ds,
        returnUrl: RETURN_URL,
      });

      const result = res.data;
      setPaymentResult(result);
      await loadCart();

      if (result.challengeRequired && result.threeDsUrl) {
        toast.info(
          "Authentification 3D Secure requise — complétez la vérification",
        );
        setThreeDsOpen(true);
      } else {
        setStep(2);
        if (result.status === "SUCCESS") {
          toast.success("✓ Paiement confirmé !");
        } else {
          toast.info(
            `Traitement terminé — Code: ${result.actionCode || "N/A"}`,
          );
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur de paiement");
    } finally {
      setLoading(false);
    }
  };

  const handle3DsComplete = () => {
    setThreeDsOpen(false);
    setStep(2);
    toast.success("Authentification 3DS terminée");
  };

  const formatCard = (v) =>
    v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  const formatExpiry = (v) =>
    v
      .replace(/\D/g, "")
      .slice(0, 4)
      .replace(/^(\d{2})(\d)/, "$1/$2");

  return (
    <div className="checkout">
      <div className="container">
        <div className="checkout__progress fade-up">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div
                className={`checkout__step ${i === step ? "checkout__step--active" : ""} ${i < step ? "checkout__step--done" : ""}`}
              >
                <div className="checkout__step-dot">
                  {i < step ? (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className="checkout__step-label">{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`checkout__step-line ${i < step ? "checkout__step-line--done" : ""}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="checkout__layout">
          {step === 0 && (
            <div className="checkout__form fade-up">
              <h2 className="checkout__section-title">Adresse de livraison</h2>
              <form onSubmit={handleCreateOrder}>
                <div className="checkout__field">
                  <label>Adresse complète *</label>
                  <input
                    type="text"
                    value={shipping.address}
                    onChange={(e) => setShipping({ address: e.target.value })}
                    placeholder="Ex: 12 Rue de la Paix, Dakar, Sénégal"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary checkout__btn"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner" />
                  ) : (
                    "Confirmer la livraison →"
                  )}
                </button>
              </form>
            </div>
          )}

          {step === 1 && (
            <div className="checkout__form fade-up">
              <h2 className="checkout__section-title">
                Informations de paiement
              </h2>
              {order?.gimPayOrderUrl && (
                <div className="checkout__paylink">
                  <div className="checkout__paylink-header">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                    </svg>
                    <span>Option 1 — Paiement via GIM Pay PayLink</span>
                  </div>
                  <p>Utilisez la page de paiement sécurisée GIM Pay :</p>
                  <a
                    href={order.gimPayOrderUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-outline checkout__paylink-btn"
                  >
                    Payer via GIM Pay PayLink →
                  </a>
                  <div className="checkout__or">
                    <span>ou payer directement par carte ci-dessous</span>
                  </div>
                </div>
              )}
              <div className="checkout__direct-label">
                {order?.gimPayOrderUrl ? "Option 2 — " : ""}Paiement direct par
                carte
              </div>
              <form onSubmit={handlePayment}>
                <div className="checkout__field">
                  <label>Numéro de carte *</label>
                  <input
                    type="text"
                    value={payment.pan}
                    onChange={(e) =>
                      setPayment((p) => ({
                        ...p,
                        pan: formatCard(e.target.value),
                      }))
                    }
                    placeholder="5219 5702 4551 7691"
                    maxLength={19}
                    required
                  />
                </div>
                <div className="checkout__row">
                  <div className="checkout__field">
                    <label>Expiration * (MM/AA)</label>
                    <input
                      type="text"
                      value={payment.dateExpiration}
                      onChange={(e) =>
                        setPayment((p) => ({
                          ...p,
                          dateExpiration: formatExpiry(e.target.value),
                        }))
                      }
                      placeholder="26/04"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="checkout__field">
                    <label>CVV *</label>
                    <input
                      type="text"
                      value={payment.cvv2}
                      onChange={(e) =>
                        setPayment((p) => ({
                          ...p,
                          cvv2: e.target.value.replace(/\D/g, "").slice(0, 4),
                        }))
                      }
                      placeholder="927"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
                <div className="checkout__3ds">
                  <label className="checkout__toggle">
                    <input
                      type="checkbox"
                      checked={!payment.disable3ds}
                      onChange={(e) =>
                        setPayment((p) => ({
                          ...p,
                          disable3ds: !e.target.checked,
                        }))
                      }
                    />
                    <div className="checkout__toggle-track">
                      <div className="checkout__toggle-thumb" />
                    </div>
                    <div className="checkout__3ds-info">
                      <span className="checkout__3ds-label">
                        Authentification 3D Secure
                        <span
                          className={`checkout__3ds-status ${!payment.disable3ds ? "checkout__3ds-status--on" : "checkout__3ds-status--off"}`}
                        >
                          {!payment.disable3ds ? "ACTIVÉE" : "DÉSACTIVÉE"}
                        </span>
                      </span>
                      <span className="checkout__3ds-desc">
                        {payment.disable3ds
                          ? "Paiement direct sans vérification supplémentaire"
                          : "Une fenêtre de vérification bancaire s'ouvrira"}
                      </span>
                    </div>
                  </label>
                </div>
                <div className="checkout__secure-note">
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
                  Paiement crypté SSL · GIM Pay · Vos données sont protégées
                </div>
                <button
                  type="submit"
                  className="btn-primary checkout__btn"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner" />
                  ) : (
                    `${payment.disable3ds ? "Payer" : "Payer avec 3D Secure"} — ${formatPrice(order?.totalAmount)}`
                  )}
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="checkout__confirmation fade-up">
              <div
                className={`checkout__confirm-icon ${paymentResult?.status === "SUCCESS" ? "checkout__confirm-icon--success" : ""}`}
              >
                {paymentResult?.status === "SUCCESS" ? "✓" : "◈"}
              </div>
              <h2 className="checkout__confirm-title">
                {paymentResult?.status === "SUCCESS"
                  ? "Paiement confirmé !"
                  : "Commande enregistrée"}
              </h2>
              <p className="checkout__confirm-sub">
                {paymentResult?.status === "SUCCESS"
                  ? "Votre paiement a été traité avec succès."
                  : paymentResult?.challengeRequired
                    ? "Authentification 3DS complétée. Votre commande a été enregistrée."
                    : `Code réponse GIM Pay : ${paymentResult?.actionCode || "N/A"} — Commande #${order?.id} créée.`}
              </p>
              <div className="checkout__confirm-details">
                <div className="checkout__confirm-row">
                  <span>Commande</span>
                  <span>#{order?.id}</span>
                </div>
                <div className="checkout__confirm-row">
                  <span>Montant</span>
                  <span className="price-small">
                    {formatPrice(order?.totalAmount)}
                  </span>
                </div>
                {paymentResult?.actionCode && (
                  <div className="checkout__confirm-row">
                    <span>Code action</span>
                    <span>{paymentResult.actionCode}</span>
                  </div>
                )}
                {paymentResult?.systemReference &&
                  paymentResult.systemReference !== "0" && (
                    <div className="checkout__confirm-row">
                      <span>Référence</span>
                      <span>{paymentResult.systemReference}</span>
                    </div>
                  )}
                {paymentResult?.challengeRequired && (
                  <div className="checkout__confirm-row">
                    <span>3D Secure</span>
                    <span style={{ color: "var(--green)" }}>✓ Authentifié</span>
                  </div>
                )}
                {order?.gimPayOrderId && (
                  <div className="checkout__confirm-row">
                    <span>GIM Pay ID</span>
                    <span>#{order.gimPayOrderId}</span>
                  </div>
                )}
              </div>
              <div className="checkout__confirm-actions">
                <button
                  className="btn-primary"
                  onClick={() => navigate("/orders")}
                >
                  Voir mes commandes
                </button>
                <button className="btn-outline" onClick={() => navigate("/")}>
                  Continuer mes achats
                </button>
              </div>
            </div>
          )}

          {step < 2 && (
            <div
              className="checkout__sidebar fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              <h3 className="checkout__sidebar-title">Votre commande</h3>
              <div className="divider-gold" style={{ margin: "16px 0" }} />
              {(order?.items?.length ? order.items : cart).map((item) => (
                <div
                  key={item.id || item.watchId}
                  className="checkout__sidebar-item"
                >
                  <div>
                    <div className="checkout__sidebar-brand">
                      {item.watchBrand}
                    </div>
                    <div className="checkout__sidebar-name">
                      {item.watchName} × {item.quantity}
                    </div>
                  </div>
                  <span>{formatPrice(item.subtotal)}</span>
                </div>
              ))}
              <div className="divider-gold" style={{ margin: "16px 0" }} />
              <div className="checkout__sidebar-total">
                <span>Total</span>
                <span className="price">
                  {formatPrice(order?.totalAmount || cartTotal)}
                </span>
              </div>
              {order?.gimPayOrderId && (
                <div className="checkout__sidebar-ref">
                  <span>GIM Pay Order</span>
                  <span>#{order.gimPayOrderId}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL 3D SECURE ── */}
      {threeDsOpen && paymentResult?.threeDsUrl && (
        <div className="checkout__3ds-modal">
          <div className="checkout__3ds-modal-inner">
            <div className="checkout__3ds-modal-header">
              <div className="checkout__3ds-modal-title">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Authentification 3D Secure
              </div>
              <span className="checkout__3ds-modal-sub">
                Complétez la vérification bancaire pour finaliser votre paiement
              </span>
            </div>
            <iframe
              src={paymentResult.threeDsUrl}
              title="3D Secure Authentication"
              className="checkout__3ds-iframe"
              allow="payment"
            />
            <div className="checkout__3ds-modal-footer">
              <div className="checkout__3ds-info-note">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Après l'authentification, cliquez sur le bouton ci-dessous
              </div>
              <button className="btn-primary" onClick={handle3DsComplete}>
                ✓ J'ai terminé l'authentification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
