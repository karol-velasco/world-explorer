import React from "react";
import { formatearNumero } from "../servicios/servicioPaises";

export function ResumenEstadisticas({ totalPaises, conteoFiltrados, poblacionTotal, conteoFavoritos }) {
  return (
    <div className="stats-banner">
      <div className="stat-card glass-panel">
        <div className="stat-icon-wrapper">🚩</div>
        <div className="stat-info">
          <div className="stat-value">{conteoFiltrados} / {totalPaises}</div>
          <div className="stat-label">Países Visibles</div>
        </div>
      </div>

      <div className="stat-card glass-panel">
        <div className="stat-icon-wrapper">👥</div>
        <div className="stat-info">
          <div className="stat-value">{formatearNumero(poblacionTotal)}</div>
          <div className="stat-label">Población Total</div>
        </div>
      </div>

      <div className="stat-card glass-panel">
        <div className="stat-icon-wrapper">⭐</div>
        <div className="stat-info">
          <div className="stat-value">{conteoFavoritos}</div>
          <div className="stat-label">Guardados</div>
        </div>
      </div>
    </div>
  );
}
