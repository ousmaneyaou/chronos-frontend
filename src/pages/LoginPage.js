import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../services/api";
import { useApp } from "../context/AppContext";
import { toast } from "react-toastify";
import "./LoginPage.css";

export default function LoginPage() {
  const { setUser } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login"); // login | register

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email) {
      toast.error("Email requis");
      return;
    }
    setLoading(true);
    try {
      const res = await userApi.create(form);
      setUser(res.data);
      toast.success(`Bienvenue, ${res.data.firstName} ✦`);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login__bg">
        <div className="login__circle login__circle--1" />
        <div className="login__circle login__circle--2" />
      </div>

      <div className="login__card fade-up">
        <div className="login__header">
          <div className="login__logo">◈ AURUM</div>
          <h1 className="login__title">
            {mode === "login" ? "Rejoindre le" : "Créer votre"}
            <br />
            <em>cercle d'exception</em>
          </h1>
          <p className="login__sub">
            {mode === "login"
              ? "Connectez-vous pour accéder à votre espace AURUM"
              : "Rejoignez notre cercle de beauté et bénéficiez de soins exclusifs"}
          </p>
        </div>

        <form className="login__form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <div className="login__row">
              <div className="login__field">
                <label>Prénom *</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Aminata"
                  required
                />
              </div>
              <div className="login__field">
                <label>Nom</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Diallo"
                />
              </div>
            </div>
          )}

          <div className="login__field">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="aminata@aurum.sn"
              required
            />
          </div>

          {mode === "register" && (
            <>
              <div className="login__field">
                <label>Téléphone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+221 77 123 45 67"
                />
              </div>
              <div className="login__field">
                <label>Adresse de livraison</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Medina, Dakar, Sénégal"
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
              "Accéder à mon espace →"
            ) : (
              "Créer mon compte →"
            )}
          </button>
        </form>

        <div className="login__switch">
          {mode === "login" ? (
            <>
              Première visite ?{" "}
              <button onClick={() => setMode("register")}>
                Créer un compte
              </button>
            </>
          ) : (
            <>
              Déjà membre ?{" "}
              <button onClick={() => setMode("login")}>Se connecter</button>
            </>
          )}
        </div>

        <div className="login__secure">
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
          Connexion sécurisée · Données protégées
        </div>
      </div>
    </div>
  );
}
