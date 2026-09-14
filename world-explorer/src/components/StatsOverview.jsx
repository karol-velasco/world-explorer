import React from "react";
import { formatNumber } from "../services/countryService";

export function StatsOverview({ totalCountries, filteredCount, totalPopulation, favCount }) {
  return (
    <div className="stats-banner">
      <div className="stat-card glass-panel">
        <div className="stat-icon-wrapper">🚩</div>
        <div className="stat-info">
          <div className="stat-value">{filteredCount} / {totalCountries}</div>
          <div className="stat-label">Países Visibles</div>
        </div>
      </div>

      <div className="stat-card glass-panel">
        <div className="stat-icon-wrapper">👥</div>
        <div className="stat-info">
          <div className="stat-value">{formatNumber(totalPopulation)}</div>
          <div className="stat-label">Población Total</div>
        </div>
      </div>

      <div className="stat-card glass-panel">
        <div className="stat-icon-wrapper">⭐</div>
        <div className="stat-info">
          <div className="stat-value">{favCount}</div>
          <div className="stat-label">Guardados</div>
        </div>
      </div>
    </div>
  );
}
