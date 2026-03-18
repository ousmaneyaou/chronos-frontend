import React, { useState, useEffect } from "react";
import { watchApi, categoryApi } from "../services/api";
import WatchCard from "../components/WatchCard";
import "./HomePage.css";

export default function HomePage() {
  const [watches, setWatches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    categoryApi
      .getAll()
      .then((r) => setCategories(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (activeCategory) params.categoryId = activeCategory;
    watchApi
      .getAll(params)
      .then((r) => setWatches(r.data || []))
      .catch(() => setWatches([]))
      .finally(() => setLoading(false));
  }, [search, activeCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setActiveCategory(null);
  };

  const handleCategory = (id) => {
    setActiveCategory(id === activeCategory ? null : id);
    setSearch("");
    setSearchInput("");
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="home__hero">
        <div className="home__hero-bg" />
        <div className="home__hero-content fade-up">
          <span className="section-label">Haute Horlogerie</span>
          <h1 className="home__hero-title">
            L'Art du
            <br />
            <em>Temps</em>
          </h1>
          <p className="home__hero-sub">
            Découvrez notre collection exclusive de montres de prestige, alliant
            tradition horlogère et excellence contemporaine.
          </p>
        </div>
        <div className="home__hero-scroll">
          <span>EXPLORER</span>
          <div className="home__hero-scroll-line" />
        </div>
      </section>

      {/* Catalogue */}
      <section className="home__catalogue">
        <div className="container">
          {/* Filters */}
          <div className="home__filters fade-up">
            {/* Search */}
            <form onSubmit={handleSearch} className="home__search">
              <input
                type="text"
                placeholder="Rechercher une montre, une marque..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button type="submit" className="home__search-btn">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </button>
            </form>

            {/* Categories */}
            <div className="home__categories">
              <button
                className={`home__cat-btn ${!activeCategory ? "home__cat-btn--active" : ""}`}
                onClick={() => handleCategory(null)}
              >
                Tous
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`home__cat-btn ${activeCategory === cat.id ? "home__cat-btn--active" : ""}`}
                  onClick={() => handleCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Results count */}
            {!loading && (
              <p className="home__count">
                {watches.length} pièce{watches.length > 1 ? "s" : ""}
                {search && ` pour "${search}"`}
                {activeCategory &&
                  ` dans ${categories.find((c) => c.id === activeCategory)?.name}`}
              </p>
            )}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="home__grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="home__skeleton-card">
                  <div
                    className="skeleton"
                    style={{ aspectRatio: "1", marginBottom: 12 }}
                  />
                  <div
                    className="skeleton"
                    style={{ height: 12, width: "40%", marginBottom: 8 }}
                  />
                  <div
                    className="skeleton"
                    style={{ height: 18, width: "70%", marginBottom: 12 }}
                  />
                  <div
                    className="skeleton"
                    style={{ height: 14, width: "50%" }}
                  />
                </div>
              ))}
            </div>
          ) : watches.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">◈</div>
              <h3>Aucune montre trouvée</h3>
              <p>Modifiez votre recherche ou explorez toute la collection.</p>
              <button
                className="btn-outline"
                style={{ marginTop: 24 }}
                onClick={() => {
                  setSearch("");
                  setSearchInput("");
                  setActiveCategory(null);
                }}
              >
                Voir toute la collection
              </button>
            </div>
          ) : (
            <div className="home__grid">
              {watches.map((w, i) => (
                <div key={w.id} style={{ animationDelay: `${i * 0.05}s` }}>
                  <WatchCard watch={w} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
