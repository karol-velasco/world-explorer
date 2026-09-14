import React from "react";

export function Navbar({ activeTab, setActiveTab, theme, toggleTheme, favCount, compareCount }) {
  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <div className="brand-logo" onClick={() => setActiveTab("all")}>
          <div className="brand-icon">🌐</div>
          <div>
            <h1 className="brand-title">World Explorer</h1>
          </div>
        </div>

        <div className="nav-actions">
          <div className="nav-tabs">
            <button
              className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              <span>🌍</span> Explorar
            </button>
            <button
              className={`tab-btn ${activeTab === "favorites" ? "active" : ""}`}
              onClick={() => setActiveTab("favorites")}
            >
              <span>⭐</span> Favoritos
              {favCount > 0 && <span className="region-badge">{favCount}</span>}
            </button>
            <button
              className={`tab-btn ${activeTab === "compare" ? "active" : ""}`}
              onClick={() => setActiveTab("compare")}
            >
              <span>⚖️</span> Comparar
              {compareCount > 0 && <span className="region-badge">{compareCount}</span>}
            </button>
          </div>

          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
}
