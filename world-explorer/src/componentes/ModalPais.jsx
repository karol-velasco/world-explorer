import React from "react";
import { formatearNumero } from "../servicios/servicioPaises";

export function ModalPais({ pais, alCerrar, esFavorito, alAlternarFavorito, estaComparando, alAlternarComparar, mapaPaises, alSeleccionarFrontera }) {
  if (!pais) return null;

  const nombreMostrar = pais.nombreEspanol || pais.nombre;

  return (
    <div className="modal-overlay" onClick={alCerrar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={alCerrar} title="Cerrar (Esc)">
          ✕
        </button>

        <div className="modal-body">
          <div className="modal-header-grid">
            <div>
              <img
                src={pais.banderaSvg || pais.banderaPng}
                alt={`Bandera de ${nombreMostrar}`}
                className="modal-flag-img"
              />
              {pais.escudo && (
                <div style={{ marginTop: "16px", textAlign: "center" }}>
                  <img
                    src={pais.escudo}
                    alt="Escudo de armas"
                    style={{ height: "60px", objectFit: "contain" }}
                  />
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>Escudo Oficial</div>
                </div>
              )}
            </div>

            <div className="modal-info-main">
              <h2 className="modal-country-name">{nombreMostrar}</h2>
              <div className="modal-country-official">{pais.nombreOficial}</div>

              <div className="modal-badge-group">
                <span className="region-badge">{pais.region}</span>
                <span className="region-badge" style={{ background: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}>
                  {pais.subregion}
                </span>
                {pais.sinSalidaMar && (
                  <span className="region-badge" style={{ background: "rgba(245, 158, 11, 0.12)", color: "#f59e0b" }}>
                    🔒 Sin salida al mar
                  </span>
                )}
                {pais.miembroOnu && (
                  <span className="region-badge" style={{ background: "rgba(59, 130, 246, 0.12)", color: "#3b82f6" }}>
                    🇺🇳 Miembro ONU
                  </span>
                )}
              </div>

              <div className="modal-actions-bar">
                <a
                  href={pais.mapaGoogleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  📍 Ver en Google Maps
                </a>

                <button
                  className={`btn-secondary ${esFavorito ? "active-fav" : ""}`}
                  onClick={() => alAlternarFavorito(pais.cca3)}
                >
                  {esFavorito ? "★ Guardado" : "☆ Favorito"}
                </button>

                <button
                  className="btn-secondary"
                  onClick={() => alAlternarComparar(pais.cca3)}
                >
                  {estaComparando ? "✓ En comparación" : "⚖️ Comparar"}
                </button>
              </div>
            </div>
          </div>

          <div className="modal-info-grid">
            <div className="modal-info-item">
              <span className="label">Capital</span>
              <span className="val">{pais.capital}</span>
            </div>

            <div className="modal-info-item">
              <span className="label">Población</span>
              <span className="val">{formatearNumero(pais.poblacion)} hab.</span>
            </div>

            <div className="modal-info-item">
              <span className="label">Área Superficial</span>
              <span className="val">{formatearNumero(pais.area)} km²</span>
            </div>

            <div className="modal-info-item">
              <span className="label">Moneda(s)</span>
              <span className="val">{pais.monedasTexto}</span>
            </div>

            <div className="modal-info-item">
              <span className="label">Idioma(s)</span>
              <span className="val">{pais.idiomasTexto}</span>
            </div>

            <div className="modal-info-item">
              <span className="label">Gentilicio</span>
              <span className="val">{pais.gentilicio}</span>
            </div>

            <div className="modal-info-item">
              <span className="label">Código Alfa-3</span>
              <span className="val">{pais.cca3}</span>
            </div>
          </div>

          {pais.fronteras && pais.fronteras.length > 0 && (
            <div className="border-countries-section">
              <h4>Países Limítrofes / Fronteras ({pais.fronteras.length}):</h4>
              <div className="borders-list">
                {pais.fronteras.map((codigoFrontera) => {
                  const paisFrontera = mapaPaises[codigoFrontera];
                  const nombreFrontera = paisFrontera ? (paisFrontera.nombreEspanol || paisFrontera.nombre) : codigoFrontera;
                  return (
                    <button
                      key={codigoFrontera}
                      className="border-chip"
                      onClick={() => paisFrontera && alSeleccionarFrontera(paisFrontera)}
                    >
                      {paisFrontera ? `${paisFrontera.banderaEmoji} ${nombreFrontera}` : codigoFrontera}
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
