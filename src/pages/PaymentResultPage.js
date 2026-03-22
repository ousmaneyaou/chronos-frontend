import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { orderApi } from "../services/api";
import { useApp } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

// Cette page est la ReturnURL de GIM Pay après authentification 3DS
// GIM Pay redirige ici avec les paramètres du résultat dans l'URL :
// /payment/result?Success=true&MerchantReference=PAY_23_xxx&ActionCode=00&SystemReference=162500

const API_URL = process.env.REACT_APP_API_URL || "/api";

export default function PaymentResultPage() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Traitement du paiement...");
  const [icon, setIcon] = useState("⏳");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const processResult = async () => {
      // 1. Lire les paramètres GIM Pay dans l'URL
      const success =
        searchParams.get("Success") === "true" ||
        searchParams.get("success") === "true";
      const merchantReference =
        searchParams.get("MerchantReference") ||
        searchParams.get("merchantReference") ||
        localStorage.getItem("pending_merchant_ref");
      const actionCode =
        searchParams.get("ActionCode") || searchParams.get("actionCode");
      const systemReference =
        searchParams.get("SystemReference") ||
        searchParams.get("systemReference");
      const orderId = localStorage.getItem("pending_order_id");

      console.log("PaymentResult params:", {
        success,
        merchantReference,
        actionCode,
        orderId,
      });

      // 2. Si on a une MerchantReference → appeler le webhook backend
      if (merchantReference) {
        try {
          await axios.post(`${API_URL}/payment/webhook`, {
            MerchantReference: merchantReference,
            Success: success,
            ActionCode: actionCode || (success ? "00" : "99"),
            SystemReference: systemReference ? parseInt(systemReference) : null,
          });
          console.log("Webhook appelé avec succès");
        } catch (err) {
          console.warn("Erreur webhook:", err.message);
        }
      }

      // 3. Polling pour vérifier le statut final
      if (orderId) {
        let attempts = 0;
        const interval = setInterval(async () => {
          attempts++;
          try {
            const res = await orderApi.getById(orderId);
            const order = res.data;

            if (
              order.status === "PAID" ||
              order.payment?.status === "SUCCESS"
            ) {
              clearInterval(interval);
              localStorage.removeItem("pending_order_id");
              localStorage.removeItem("pending_merchant_ref");
              setStatus("Paiement confirmé !");
              setIcon("✓");
              toast.success("✓ Paiement confirmé !");
              setTimeout(() => navigate("/orders"), 1500);
            } else if (order.status === "FAILED") {
              clearInterval(interval);
              localStorage.removeItem("pending_order_id");
              localStorage.removeItem("pending_merchant_ref");
              setStatus("Paiement échoué");
              setIcon("✗");
              toast.error("Paiement échoué");
              setTimeout(() => navigate("/orders"), 2000);
            } else if (attempts >= 10) {
              clearInterval(interval);
              localStorage.removeItem("pending_order_id");
              localStorage.removeItem("pending_merchant_ref");
              // Si success=true mais statut pas encore mis à jour
              if (success) {
                setStatus("Paiement traité !");
                setIcon("✓");
                toast.success("Paiement traité — vérifiez vos commandes");
              } else {
                setStatus("Vérifiez vos commandes");
                setIcon("◈");
              }
              setTimeout(() => navigate("/orders"), 1500);
            }
          } catch (err) {
            if (attempts >= 10) {
              clearInterval(interval);
              navigate("/orders");
            }
          }
        }, 2000);
      } else {
        // Pas d'orderId → rediriger directement
        if (success) {
          setStatus("Paiement confirmé !");
          setIcon("✓");
          toast.success("✓ Paiement confirmé !");
        } else {
          setStatus("Vérifiez vos commandes");
          setIcon("◈");
        }
        setTimeout(() => navigate("/orders"), 2000);
      }
    };

    processResult();
  }, [user, navigate, searchParams]);

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
            icon === "✓"
              ? "#4caf50"
              : icon === "✗"
                ? "#f44336"
                : "var(--gold, #c9a84c)",
        }}
      >
        {icon}
      </div>
      <h2
        style={{
          color: "var(--white, #f5f0e8)",
          fontFamily: "Cormorant Garamond, serif",
          fontSize: "2rem",
          textAlign: "center",
        }}
      >
        {status}
      </h2>
      <p style={{ color: "var(--gray, #888)", fontSize: "14px" }}>
        Redirection automatique vers vos commandes...
      </p>
    </div>
  );
}
