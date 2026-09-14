import React from "react";
import { formatearNumero } from "../servicios/servicioPaises";

// Componente para mostrar las tarjetas resumen de números
export function ResumenEstadisticas({ totalPaises, conteoFiltrados, poblacionTotal, conteoFavoritos }) {
  return (
    <div className="stats-banner">
      <div className="stat-card glass-panel">
        <div className="stat-icon-wrapper">P</div>
        <div className="stat-info">
          <div className="stat-value">{conteoFiltrados} / {totalPaises}</div>
          <div className="stat-label">Países Mostrados</div>
        </div>
      </div>

      <div className="stat-card glass-panel">
        <div className="stat-icon-wrapper">H</div>
        <div className="stat-info">
          <div className="stat-value">{formatearNumero(poblacionTotal)}</div>
          <div className="stat-label">Población Sumada</div>
        </div>
      </div>

      <div className="stat-card glass-panel">
        <div className="stat-icon-wrapper">F</div>
        <div className="stat-info">
          <div className="stat-value">{conteoFavoritos}</div>
          <div className="stat-label">Guardados</div>
        </div>
      </div>
    </div>
  );
}
