import React from "react";
import { formatNumber } from "../services/countryService";

export function CountryModal({ country, onClose, isFavorite, onToggleFavorite, isComparing, onToggleCompare, allCountriesMap, onSelectBorder }) {
  if (!country) return null;

  const displayName = country.spanishName || country.name;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} title="Cerrar (Esc)">
          ✕
        </button>

        <div className="modal-body">
          <div className="modal-header-grid">
            <div>
              <img
                src={country.flagSvg || country.flagPng}
                alt={`Bandera de ${displayName}`}
                className="modal-flag-img"
              />
              {country.coatOfArms && (
                <div style={{ marginTop: "16px", textAlign: "center" }}>
                  <img
                    src={country.coatOfArms}
                    alt="Escudo de armas"
                    style={{ height: "60px", objectFit: "contain" }}
                  />
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>Escudo Oficial</div>
                </div>
              )}
            </div>

            <div className="modal-info-main">
              <h2 className="modal-country-name">{displayName}</h2>
              <div className="modal-country-official">{country.officialName}</div>

              <div className="modal-badge-group">
                <span className="region-badge">{country.region}</span>
                <span className="region-badge" style={{ background: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}>
                  {country.subregion}
                </span>
                {country.landlocked && (
                  <span className="region-badge" style={{ background: "rgba(245, 158, 11, 0.12)", color: "#f59e0b" }}>
                    🔒 Sin salida al mar
                  </span>
                )}
                {country.unMember && (
                  <span className="region-badge" style={{ background: "rgba(59, 130, 246, 0.12)", color: "#3b82f6" }}>
                    🇺🇳 Miembro ONU
                  </span>
                )}
              </div>

              <div className="modal-actions-bar">
                <a
                  href={country.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  📍 Ver en Google Maps
                </a>

                <button
                  className={`btn-secondary ${isFavorite ? "active-fav" : ""}`}
                  onClick={() => onToggleFavorite(country.cca3)}
                >
                  {isFavorite ? "★ Guardado" : "☆ Favorito"}
                </button>

                <button
                  className="btn-secondary"
                  onClick={() => onToggleCompare(country.cca3)}
                >
                  {isComparing ? "✓ En comparación" : "⚖️ Comparar"}
                </button>
              </div>
            </div>
          </div>

          <div className="modal-info-grid">
            <div className="modal-info-item">
              <span className="label">Capital</span>
              <span className="val">{country.capital}</span>
            </div>

            <div className="modal-info-item">
              <span className="label">Población</span>
              <span className="val">{formatNumber(country.population)} hab.</span>
            </div>

            <div className="modal-info-item">
              <span className="label">Área Superficial</span>
              <span className="val">{formatNumber(country.area)} km²</span>
            </div>

            <div className="modal-info-item">
              <span className="label">Moneda(s)</span>
              <span className="val">{country.currenciesStr}</span>
            </div>

            <div className="modal-info-item">
              <span className="label">Idioma(s)</span>
              <span className="val">{country.languagesStr}</span>
            </div>

            <div className="modal-info-item">
              <span className="label">Gentilicio</span>
              <span className="val">{country.demonym}</span>
            </div>

            <div className="modal-info-item">
              <span className="label">Código Alfa-3</span>
              <span className="val">{country.cca3}</span>
            </div>
          </div>

          {country.borders && country.borders.length > 0 && (
            <div className="border-countries-section">
              <h4>Países Limítrofes / Fronteras ({country.borders.length}):</h4>
              <div className="borders-list">
                {country.borders.map((bCode) => {
                  const borderCountry = allCountriesMap[bCode];
                  const borderName = borderCountry ? (borderCountry.spanishName || borderCountry.name) : bCode;
                  return (
                    <button
                      key={bCode}
                      className="border-chip"
                      onClick={() => borderCountry && onSelectBorder(borderCountry)}
                    >
                      {borderCountry ? `${borderCountry.flagEmoji} ${borderName}` : bCode}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
