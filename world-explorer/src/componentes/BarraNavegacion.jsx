import React from "react";

// Componente para la barra superior de la página
export function BarraNavegacion({ pestanaActiva, setPestanaActiva, tema, alternarTema, conteoFavoritos, conteoComparar }) {
  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        {/* Título de la aplicación */}
        <div className="brand-logo" onClick={() => setPestanaActiva("todos")}>
          <div className="brand-icon">WE</div>
          <div>
            <h1 className="brand-title">World Explorer</h1>
          </div>
        </div>

        {/* Botones de Navegación y Tema */}
        <div className="nav-actions">
          <div className="nav-tabs">
            <button
              className={`tab-btn ${pestanaActiva === "todos" ? "active" : ""}`}
              onClick={() => setPestanaActiva("todos")}
            >
              Todos
            </button>

            <button
              className={`tab-btn ${pestanaActiva === "favoritos" ? "active" : ""}`}
              onClick={() => setPestanaActiva("favoritos")}
            >
              Favoritos ({conteoFavoritos})
            </button>

            <button
              className={`tab-btn ${pestanaActiva === "comparar" ? "active" : ""}`}
              onClick={() => setPestanaActiva("comparar")}
            >
              Comparar ({conteoComparar})
            </button>
          </div>

          <button className="theme-toggle-btn" onClick={alternarTema}>
            {tema === "dark" ? "Modo Claro" : "Modo Oscuro"}
          </button>
        </div>
      </div>
    </nav>
  );
}
