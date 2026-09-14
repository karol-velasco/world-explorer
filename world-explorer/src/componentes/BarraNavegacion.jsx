import React from "react";

export function BarraNavegacion({ pestanaActiva, setPestanaActiva, tema, alternarTema, conteoFavoritos, conteoComparar }) {
  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <div className="brand-logo" onClick={() => setPestanaActiva("todos")}>
          <div className="brand-icon">🌐</div>
          <div>
            <h1 className="brand-title">World Explorer</h1>
          </div>
        </div>

        <div className="nav-actions">
          <div className="nav-tabs">
            <button
              className={`tab-btn ${pestanaActiva === "todos" ? "active" : ""}`}
              onClick={() => setPestanaActiva("todos")}
            >
              <span>🌍</span> Explorar
            </button>
            <button
              className={`tab-btn ${pestanaActiva === "favoritos" ? "active" : ""}`}
              onClick={() => setPestanaActiva("favoritos")}
            >
              <span>⭐</span> Favoritos
              {conteoFavoritos > 0 && <span className="region-badge">{conteoFavoritos}</span>}
            </button>
            <button
              className={`tab-btn ${pestanaActiva === "comparar" ? "active" : ""}`}
              onClick={() => setPestanaActiva("comparar")}
            >
              <span>⚖️</span> Comparar
              {conteoComparar > 0 && <span className="region-badge">{conteoComparar}</span>}
            </button>
          </div>

          <button
            className="theme-toggle-btn"
            onClick={alternarTema}
            title={tema === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            {tema === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
}
