import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { watchApi, categoryApi, cartApi } from "../services/api";
import { useApp } from "../context/AppContext";
import { toast } from "react-toastify";
import "./HomePage.css";

export default function HomePage() {
  const { user, loadCart } = useApp();
  const navigate = useNavigate();
  const [perfumes, setPerfumes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const heroRef = useRef(null);

  useEffect(() => {
    Promise.all([watchApi.getAll(), categoryApi.getAll()])
      .then(([pw, pc]) => {
        setPerfumes(pw.data || []);
        setCategories(pc.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".fade-up").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [loading]);

  const filtered = activeCategory
    ? perfumes.filter(
        (p) =>
          p.categoryId === activeCategory || p.category?.id === activeCategory,
      )
    : perfumes;

  const handleAdd = async (perfume) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setAddingId(perfume.id);
    try {
      await cartApi.addItem(user.id, { watchId: perfume.id, quantity: 1 });
      await loadCart();
      toast.success(`${perfume.name} ajouté au panier`);
    } catch {
      toast.error("Erreur lors de l'ajout");
    } finally {
      setAddingId(null);
    }
  };

  const formatPrice = (p) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(p || 0);

  return (
    <div className="home">
      {/* ── HERO ───────────────────────────────────────── */}
      <section className="hero" ref={heroRef}>
        <div className="hero__left">
          <p className="hero__eyebrow fade-up">
            Haute Parfumerie · Collection 2025
          </p>
          <h1
            className="hero__title fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            L'Art
            <br />
            du <em>Désir</em>
          </h1>
          <p
            className="hero__subtitle fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Parfums d'exception · Créés avec soin
            <br />
            Pour elle · Pour lui · Pour l'instant
          </p>
          <div
            className="hero__actions fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <button
              className="btn-primary"
              onClick={() =>
                document
                  .getElementById("collection")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Explorer la collection
            </button>
            <button
              className="hero__link"
              onClick={() =>
                document
                  .getElementById("maison")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Notre histoire
            </button>
          </div>
          <div className="hero__scroll">
            <div className="hero__scroll-line" />
            <span>Découvrir</span>
          </div>
        </div>
        <div className="hero__right">
          <div className="hero__bottle-container">
            <div className="hero__bottle">
              <div className="hero__bottle-cap" />
              <div className="hero__bottle-neck" />
              <div className="hero__bottle-body">
                <div className="hero__bottle-shine" />
                <div className="hero__bottle-label">
                  <span className="hero__bottle-name">Velour</span>
                  <span className="hero__bottle-ref">
                    N° 01 · Eau de Parfum
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="hero__quote">
            <p>« L'invisible qui séduit »</p>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ────────────────────────────────────── */}
      <div className="marquee">
        <div className="marquee__track">
          {[
            "Rose de Grasse",
            "Oud Précieux",
            "Vétiver d'Haïti",
            "Ambre Gris",
            "Jasmin Absolu",
            "Bois de Santal",
            "Iris de Florence",
            "Musc Blanc",
            "Rose de Grasse",
            "Oud Précieux",
            "Vétiver d'Haïti",
            "Ambre Gris",
            "Jasmin Absolu",
            "Bois de Santal",
            "Iris de Florence",
            "Musc Blanc",
          ].map((item, i) => (
            <span className="marquee__item" key={i}>
              <span className="marquee__dot" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── COLLECTION ─────────────────────────────────── */}
      <section className="collection" id="collection">
        <div className="container">
          <div className="collection__header fade-up">
            <div>
              <span className="section-label">Nos créations</span>
              <h2 className="section-title">
                La <em>Collection</em>
                <br />
                Signature
              </h2>
            </div>
          </div>

          {/* Filtres */}
          <div
            className="collection__filters fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            <button
              className={`collection__filter ${!activeCategory ? "active" : ""}`}
              onClick={() => setActiveCategory(null)}
            >
              Tous
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`collection__filter ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Grille */}
          {loading ? (
            <div className="collection__grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="perfume-card-skeleton">
                  <div className="skeleton" style={{ height: 340 }} />
                  <div style={{ padding: "20px" }}>
                    <div
                      className="skeleton"
                      style={{ height: 12, width: "60%", marginBottom: 8 }}
                    />
                    <div
                      className="skeleton"
                      style={{ height: 20, width: "80%", marginBottom: 8 }}
                    />
                    <div
                      className="skeleton"
                      style={{ height: 10, width: "50%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="collection__grid">
              {filtered.map((perfume, i) => (
                <article
                  key={perfume.id}
                  className="perfume-card fade-up"
                  style={{ animationDelay: `${i * 0.07}s` }}
                  onClick={() => navigate(`/watch/${perfume.id}`)}
                >
                  <div className="perfume-card__image">
                    {perfume.imageUrl ? (
                      <img
                        src={perfume.imageUrl}
                        alt={perfume.name}
                        loading="lazy"
                      />
                    ) : (
                      <div className="perfume-card__placeholder">◈</div>
                    )}
                    <div className="perfume-card__overlay">
                      <button
                        className="perfume-card__quick-add"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdd(perfume);
                        }}
                        disabled={addingId === perfume.id}
                      >
                        {addingId === perfume.id ? (
                          <span className="spinner" />
                        ) : (
                          "Ajouter au panier"
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="perfume-card__info">
                    <span className="perfume-card__category">
                      {perfume.category?.name || perfume.categoryName}
                    </span>
                    <h3 className="perfume-card__name">{perfume.name}</h3>
                    <p className="perfume-card__brand">{perfume.brand}</p>
                    <div className="perfume-card__footer">
                      <span className="price-small">
                        {formatPrice(perfume.price)}
                      </span>
                      <button
                        className="perfume-card__add"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdd(perfume);
                        }}
                        disabled={addingId === perfume.id}
                      >
                        {addingId === perfume.id ? (
                          <span className="spinner" />
                        ) : (
                          "+"
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── MAISON ─────────────────────────────────────── */}
      <section className="maison" id="maison">
        <div className="maison__visual">
          <div className="maison__visual-content">
            <div className="maison__letter">V</div>
            <div className="maison__divider" />
            <p className="maison__quote">
              « Chaque flacon est une promesse — celle d'un instant inoubliable
              »
            </p>
          </div>
        </div>
        <div className="maison__content">
          <span className="section-label fade-up">Notre Maison</span>
          <h2
            className="section-title fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            L'art de
            <br />
            <em>l'essentiel</em>
          </h2>
          <p
            className="maison__text fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Fondée sur la passion des matières premières nobles, Velour crée des
            parfums d'exception qui transcendent les saisons et les tendances.
            Chaque création naît d'un dialogue entre tradition et modernité,
            entre l'intime et l'universel.
          </p>
          <div
            className="maison__stats fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            {[
              ["9", "Créations"],
              ["38", "Ingrédients rares"],
              ["12", "Années d'expertise"],
            ].map(([n, l]) => (
              <div className="maison__stat" key={l}>
                <span className="maison__stat-number">{n}</span>
                <span className="maison__stat-label">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ─────────────────────────────────── */}
      <section className="newsletter">
        <div className="container">
          <span className="section-label" style={{ color: "var(--silver)" }}>
            Rejoindre Velour
          </span>
          <h2 className="section-title" style={{ color: "var(--white)" }}>
            L'essence <em>en avant-première</em>
          </h2>
          <p className="newsletter__sub">
            Nouvelles créations · Accès exclusifs · L'art du parfum
          </p>
          <div className="newsletter__form">
            <input
              type="email"
              placeholder="Votre adresse e-mail"
              className="newsletter__input"
            />
            <button className="newsletter__btn">S'inscrire</button>
          </div>
        </div>
      </section>
    </div>
  );
}
