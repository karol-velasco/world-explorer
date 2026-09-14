import React from "react";
import { formatearNumero } from "../servicios/servicioPaises";

export function ComparadorPaises({ listaComparacion, alRemoverComparacion, alLimpiarTodo, alSeleccionarPais }) {
  if (listaComparacion.length === 0) {
    return (
      <div className="empty-state glass-panel">
        <div style={{ fontSize: "3rem" }}>⚖️</div>
        <h2>Comparador de Países</h2>
        <p style={{ color: "var(--text-muted)", maxWidth: "450px" }}>
          Haz clic en el icono de báscula (⚖️) en la tarjeta de cualquier país para seleccionarlo y comparar sus datos demográficos y geográficos lado a lado.
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Comparando {listaComparacion.length} País(es)</h2>
        <button className="btn-secondary" onClick={alLimpiarTodo}>
          Limpiar comparación
        </button>
      </div>

      <div className="compare-container">
        {listaComparacion.map((c) => {
          const densidad = c.area > 0 ? (c.poblacion / c.area).toFixed(1) : "N/A";
          const nombreMostrar = c.nombreEspanol || c.nombre;

          return (
            <div key={c.cca3} className="compare-card glass-panel">
              <button
                className="remove-compare-btn"
                onClick={() => alRemoverComparacion(c.cca3)}
                title="Quitar"
              >
                ✕
              </button>

              <img
                src={c.banderaPng}
                alt={`Bandera de ${nombreMostrar}`}
                style={{ width: "80px", height: "54px", objectFit: "cover", borderRadius: "6px", marginBottom: "12px", boxShadow: "var(--shadow-sm)" }}
              />

              <h3 style={{ fontSize: "1.1rem", marginBottom: "4px", cursor: "pointer" }} onClick={() => alSeleccionarPais(c)}>
                {nombreMostrar}
              </h3>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "16px" }}>{c.capital}</div>

              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px", textAlign: "left", fontSize: "0.85rem" }}>
                <div className="modal-info-item">
                  <span className="label">Región</span>
                  <span className="val">{c.region} ({c.subregion})</span>
                </div>

                <div className="modal-info-item">
                  <span className="label">Población</span>
                  <span className="val">{formatearNumero(c.poblacion)} hab.</span>
                </div>

                <div className="modal-info-item">
                  <span className="label">Área</span>
                  <span className="val">{formatearNumero(c.area)} km²</span>
                </div>

                <div className="modal-info-item">
                  <span className="label">Densidad Pob.</span>
                  <span className="val">{densidad} hab/km²</span>
                </div>

                <div className="modal-info-item">
                  <span className="label">Moneda</span>
                  <span className="val">{c.monedasTexto}</span>
                </div>

                <div className="modal-info-item">
                  <span className="label">Idiomas</span>
                  <span className="val">{c.idiomasTexto}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
