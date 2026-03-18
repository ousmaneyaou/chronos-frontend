import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../services/api";
import { useApp } from "../context/AppContext";
import { toast } from "react-toastify";
import "./LoginPage.css";

export default function LoginPage() {
  const { login, user } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });

  // Si déjà connecté, rediriger
  if (user) {
    navigate("/");
    return null;
  }

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email) {
      toast.error("Email requis");
      return;
    }

    setLoading(true);
    try {
      if (mode === "register") {
        if (!form.firstName || !form.lastName) {
          toast.error("Prénom et nom requis");
          setLoading(false);
          return;
        }
        const res = await userApi.create(form);
        login(res.data);
        toast.success(`Bienvenue, ${res.data.firstName} !`);
        navigate("/");
      } else {
        // Login : recherche par email (simplifié, pas de vrai auth)
        // Dans ce cas on crée si n'existe pas, sinon on récupère
        try {
          const res = await userApi.create({
            ...form,
            firstName: form.firstName || "Client",
            lastName: form.lastName || "",
          });
          login(res.data);
          toast.success(`Connecté en tant que ${res.data.firstName}`);
          navigate("/");
        } catch (err) {
          // Email déjà utilisé → simuler une connexion
          if (
            err.response?.status === 400 ||
            err.response?.data?.includes?.("Email")
          ) {
            toast.error(
              "Cet email est déjà utilisé. Utilisez un autre email ou inscrivez-vous.",
            );
          } else {
            toast.error("Erreur de connexion");
          }
        }
      }
    } catch (err) {
      toast.error(err.response?.data || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login__bg" />
      <div className="login__card fade-up">
        {/* Logo */}
        <div className="login__logo">
          <span className="login__logo-icon">◈</span>
          <span className="login__logo-text">WATCHSTORE</span>
        </div>

        <div className="divider-gold" />

        <h2 className="login__title">
          {mode === "login" ? "Connexion" : "Créer un compte"}
        </h2>
        <p className="login__subtitle">
          {mode === "login"
            ? "Entrez votre email pour accéder à votre espace"
            : "Rejoignez notre cercle de passionnés de montre"}
        </p>

        <form onSubmit={handleSubmit} className="login__form">
          <div className="login__field">
            <label>Adresse email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="votre@email.com"
              required
            />
          </div>

          {mode === "register" && (
            <>
              <div className="login__row">
                <div className="login__field">
                  <label>Prénom *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={onChange}
                    placeholder="Texte..."
                    required
                  />
                </div>
                <div className="login__field">
                  <label>Nom *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={onChange}
                    placeholder="Texte..."
                    required
                  />
                </div>
              </div>
              <div className="login__field">
                <label>Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="+221 77 ___ __ __"
                />
              </div>
              <div className="login__field">
                <label>Adresse de livraison</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={onChange}
                  placeholder="Votre adresse complète"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn-primary login__submit"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner" />
            ) : mode === "login" ? (
              "Se connecter"
            ) : (
              "Créer mon compte"
            )}
          </button>
        </form>

        <div className="login__switch">
          {mode === "login" ? (
            <p>
              Pas encore de compte ?
              <button onClick={() => setMode("register")}>
                {" "}
                Créer un compte
              </button>
            </p>
          ) : (
            <p>
              Déjà un compte ?
              <button onClick={() => setMode("login")}> Se connecter</button>
            </p>
          )}
        </div>

        {/* Note sécurité */}
        <div className="login__note">
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
          Paiements sécurisés par GIM Pay
        </div>
      </div>
    </div>
  );
}
