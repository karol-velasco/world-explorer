import React from "react";
import { formatNumber } from "../services/countryService";

export function CountryCard({ country, onSelect, isFavorite, onToggleFavorite, isComparing, onToggleCompare }) {
  const displayName = country.spanishName || country.name;

  return (
    <div className="country-card" onClick={() => onSelect(country)}>
      <div className="flag-container">
        <img
          src={country.flagPng}
          alt={`Bandera de ${displayName}`}
          className="flag-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://flagcdn.com/w320/${country.cca2.toLowerCase()}.png`;
          }}
        />

        <div className="card-top-actions" onClick={(e) => e.stopPropagation()}>
          <button
            className={`action-icon-btn ${isFavorite ? "active-fav" : ""}`}
            onClick={() => onToggleFavorite(country.cca3)}
            title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
          >
            {isFavorite ? "★" : "☆"}
          </button>
          <button
            className={`action-icon-btn ${isComparing ? "active-compare" : ""}`}
            onClick={() => onToggleCompare(country.cca3)}
            title={isComparing ? "Quitar de comparación" : "Añadir a comparación"}
          >
            ⚖️
          </button>
        </div>
      </div>

      <div className="card-content">
        <h3 className="country-title">{displayName}</h3>
        <p className="country-subtitle">{country.name !== displayName ? country.name : country.officialName}</p>

        <div className="card-details">
          <div className="detail-row">
            <span className="detail-label">Capital:</span>
            <span className="detail-val">{country.capital}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Población:</span>
            <span className="detail-val">{formatNumber(country.population)}</span>
          </div>

          <div className="detail-row" style={{ marginTop: "6px" }}>
            <span className="detail-label">Región:</span>
            <span className="region-badge">{country.region}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
