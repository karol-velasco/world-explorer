import React from "react";
import { formatearNumero } from "../servicios/servicioPaises";

// Componente Ventana Modal para ver todos los detalles de un país
export function ModalPais({ pais, alCerrar, esFavorito, alAlternarFavorito, estaComparando, alAlternarComparar, mapaPaises, alSeleccionarFrontera }) {
  // Si no hay un país seleccionado, no dibujamos nada
  if (!pais) return null;

  return (
    <div className="modal-overlay" onClick={alCerrar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Botón para cerrar */}
        <button className="modal-close-btn" onClick={alCerrar} title="Cerrar">
          ✕
        </button>

        <div className="modal-body">
          <div className="modal-header-grid">
            <div>
              <img src={pais.bandera} alt={pais.nombre} className="modal-flag-img" />
              {pais.escudo && (
                <div style={{ marginTop: "16px", textAlign: "center" }}>
                  <img src={pais.escudo} alt="Escudo" style={{ height: "60px", objectFit: "contain" }} />
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Escudo Oficial</div>
                </div>
              )}
            </div>

            <div className="modal-info-main">
              <h2 className="modal-country-name">{pais.nombre}</h2>
              <div className="modal-country-official">{pais.nombreOficial}</div>

              <div className="modal-badge-group">
                <span className="region-badge">{pais.region}</span>
                <span className="region-badge" style={{ background: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}>
                  {pais.subregion}
                </span>
                {pais.sinSalidaMar && (
                  <span className="region-badge" style={{ background: "rgba(245, 158, 11, 0.12)", color: "#f59e0b" }}>
                    Sin salida al mar
                  </span>
                )}
                {pais.miembroOnu && (
                  <span className="region-badge" style={{ background: "rgba(59, 130, 246, 0.12)", color: "#3b82f6" }}>
                    Miembro ONU
                  </span>
                )}
              </div>

              <div className="modal-actions-bar">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pais.nombre)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Ver en Google Maps
                </a>

                <button className="btn-secondary" onClick={() => alAlternarFavorito(pais.codigo)}>
                  {esFavorito ? "Guardado" : "Favorito"}
                </button>

                <button className="btn-secondary" onClick={() => alAlternarComparar(pais.codigo)}>
                  {estaComparando ? "En comparación" : "Comparar"}
                </button>
              </div>
            </div>
          </div>

          {/* Grilla de datos clave */}
          <div className="modal-info-grid">
            <div className="modal-info-item">
              <span className="label">Capital</span>
              <span className="val">{pais.capital}</span>
            </div>

            <div className="modal-info-item">
              <span className="label">Población</span>
              <span className="val">{formatearNumero(pais.poblacion)} habitantes</span>
            </div>

            <div className="modal-info-item">
              <span className="label">Superficie</span>
              <span className="val">{formatearNumero(pais.area)} km²</span>
            </div>

            <div className="modal-info-item">
              <span className="label">Monedas</span>
              <span className="val">{pais.monedas}</span>
            </div>

            <div className="modal-info-item">
              <span className="label">Idiomas</span>
              <span className="val">{pais.idiomas}</span>
            </div>

            <div className="modal-info-item">
              <span className="label">Código País</span>
              <span className="val">{pais.codigo}</span>
            </div>
          </div>

          {/* Botones de países limítrofes */}
          {pais.fronteras && pais.fronteras.length > 0 && (
            <div className="border-countries-section">
              <h4>Países Fronterizos ({pais.fronteras.length}):</h4>
              <div className="borders-list">
                {pais.fronteras.map((codigoVecino) => {
                  const vecino = mapaPaises[codigoVecino];
                  const nombreVecino = vecino ? vecino.nombre : codigoVecino;
                  return (
                    <button
                      key={codigoVecino}
                      className="border-chip"
                      onClick={() => vecino && alSeleccionarFrontera(vecino)}
                    >
                      {nombreVecino}
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
