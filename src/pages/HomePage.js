import React, { useState, useEffect } from "react";
import { watchApi, categoryApi } from "../services/api";
import WatchCard from "../components/WatchCard";
import "./HomePage.css";

export default function HomePage() {
  const [watches, setWatches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    Promise.all([watchApi.getAll(), categoryApi.getAll()])
      .then(([wRes, cRes]) => {
        setWatches(wRes.data || []);
        setCategories(cRes.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = watches.filter((w) => {
    const matchCat = !activeCategory || w.category?.id === activeCategory;
    const matchSearch =
      !searchTerm ||
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="home">
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__circle hero__circle--1" />
          <div className="hero__circle hero__circle--2" />
          <div className="hero__circle hero__circle--3" />
        </div>
        <div className="hero__content">
          <p className="hero__pre">Maison de soins d'exception · Fondée 2009</p>
          <h1 className="hero__title">
            L'Art de la
            <br />
            <em>Peau Sublime</em>
          </h1>
          <p className="hero__sub">
            Formules alchimiques · Ingrédients rares
            <br />
            Rituels de beauté transmis par les anciens
          </p>
          <div className="hero__scroll">
            <span className="hero__scroll-text">Découvrir</span>
            <div className="hero__scroll-line" />
          </div>
        </div>
      </section>

      {/* ── BANDEAU VALEURS ───────────────────────────────────────────── */}
      <div className="values-bar">
        {[
          "98% Ingrédients naturels",
          "Formules alchimiques",
          "Livraison sécurisée",
          "Paiement GIM Pay",
        ].map((v) => (
          <div key={v} className="values-bar__item">
            <span className="values-bar__dot">◈</span>
            <span>{v}</span>
          </div>
        ))}
      </div>

      {/* ── CATALOGUE ─────────────────────────────────────────────────── */}
      <section className="catalogue">
        <div className="container">
          {/* En-tête */}
          <div className="catalogue__header fade-up">
            <div>
              <span className="section-label">La collection AURUM</span>
              <h2 className="section-title">
                Trésors de <em>beauté</em>
              </h2>
            </div>
            <div className="catalogue__search">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher un soin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filtres catégories */}
          <div className="catalogue__filters fade-up">
            <button
              className={`catalogue__filter ${!activeCategory ? "catalogue__filter--active" : ""}`}
              onClick={() => setActiveCategory(null)}
            >
              Tous les soins
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                className={`catalogue__filter ${activeCategory === c.id ? "catalogue__filter--active" : ""}`}
                onClick={() => setActiveCategory(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Grille produits */}
          {loading ? (
            <div className="catalogue__grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="skeleton"
                  style={{ aspectRatio: "1/1.4", borderRadius: 0 }}
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state fade-up">
              <div className="empty-icon">◈</div>
              <h3>Aucun produit trouvé</h3>
              <p>Essayez une autre recherche ou une autre catégorie.</p>
            </div>
          ) : (
            <div className="catalogue__grid fade-up">
              {filtered.map((w, i) => (
                <div key={w.id} style={{ animationDelay: `${i * 0.06}s` }}>
                  <WatchCard watch={w} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── SECTION RITUEL ────────────────────────────────────────────── */}
      <section className="ritual-strip">
        <div className="container ritual-strip__inner">
          <div className="ritual-strip__text">
            <span className="section-label">La méthode AURUM</span>
            <h2 className="section-title">
              Le <em>rituel</em> quotidien
            </h2>
            <p className="ritual-strip__desc">
              Chaque formule AURUM est conçue pour s'intégrer à votre rituel de
              beauté. Purifiez, révélez, nourrissez, sublimez — quatre gestes
              simples pour une peau d'exception.
            </p>
            <div className="ritual-strip__steps">
              {["Purifier", "Révéler", "Nourrir", "Sublimer"].map((s, i) => (
                <div key={s} className="ritual-strip__step">
                  <div className="ritual-strip__step-num">0{i + 1}</div>
                  <div className="ritual-strip__step-name">{s}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="ritual-strip__deco">
            <div className="ritual-strip__glow">
              <span
                style={{
                  fontFamily: "var(--font-brand)",
                  fontSize: 40,
                  color: "var(--or)",
                  opacity: 0.6,
                  letterSpacing: 8,
                }}
              >
                ✦
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__brand">
            <span className="footer__logo">◈ AURUM</span>
            <p className="footer__tagline">
              Haute Horlogerie · Paiements sécurisés par GIM Pay
            </p>
          </div>
          <div className="footer__badges">
            {[
              "InitiateOrder ✓",
              "PayByCard 3DS ON ✓",
              "PayByCard 3DS OFF ✓",
              "Webhook ✓",
            ].map((b) => (
              <span key={b} className="footer__badge">
                {b}
              </span>
            ))}
          </div>
          <p className="footer__copy">© 2025 AURUM · Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}
