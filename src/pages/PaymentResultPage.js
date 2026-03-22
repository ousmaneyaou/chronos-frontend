import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderApi } from "../services/api";
import { useApp } from "../context/AppContext";
import { toast } from "react-toastify";

// Cette page est la ReturnURL de GIM Pay après authentification 3DS
// GIM Pay redirige le navigateur ici après que le client valide l'OTP

export default function PaymentResultPage() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [status, setStatus] = useState("Vérification du paiement...");
  const [icon, setIcon] = useState("⏳");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Récupérer l'orderId sauvegardé avant l'ouverture de l'iframe
    const orderId = localStorage.getItem("pending_order_id");

    if (!orderId) {
      // Pas d'orderId → rediriger vers commandes directement
      navigate("/orders");
      return;
    }

    setStatus("Vérification du paiement en cours...");
    setIcon("⏳");

    let attempts = 0;
    const maxAttempts = 15; // 30 secondes max

    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await orderApi.getById(orderId);
        const order = res.data;

        if (order.status === "PAID" || order.payment?.status === "SUCCESS") {
          clearInterval(interval);
          localStorage.removeItem("pending_order_id");
          setStatus("Paiement confirmé !");
          setIcon("✓");
          toast.success("✓ Paiement confirmé !");
          setTimeout(() => navigate("/orders"), 1500);
        } else if (order.status === "FAILED") {
          clearInterval(interval);
          localStorage.removeItem("pending_order_id");
          setStatus("Paiement échoué");
          setIcon("✗");
          toast.error("Paiement échoué");
          setTimeout(() => navigate("/orders"), 2000);
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          localStorage.removeItem("pending_order_id");
          setStatus("Vérification terminée");
          setIcon("◈");
          toast.info("Vérifiez vos commandes");
          setTimeout(() => navigate("/orders"), 1500);
        }
      } catch (err) {
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          localStorage.removeItem("pending_order_id");
          navigate("/orders");
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [user, navigate]);

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
      }}
    >
      <div
        style={{
          fontSize: "64px",
          color:
            icon === "✓" ? "var(--green, #4caf50)" : "var(--gold, #c9a84c)",
        }}
      >
        {icon}
      </div>
      <h2
        style={{
          color: "var(--white, #f5f0e8)",
          fontFamily: "Cormorant Garamond, serif",
        }}
      >
        {status}
      </h2>
      <p style={{ color: "var(--gray, #888)", fontSize: "14px" }}>
        Redirection automatique vers vos commandes...
      </p>
      <div
        style={{
          width: "40px",
          height: "4px",
          background: "var(--gold, #c9a84c)",
          borderRadius: "2px",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
    </div>
  );
}
