import React from "react";
import { formatearNumero } from "../servicios/servicioPaises";

// Componente para comparar países seleccionados en tarjetas paralelas
export function ComparadorPaises({ listaComparacion, alRemoverComparacion, alLimpiarTodo, alSeleccionarPais }) {
  if (listaComparacion.length === 0) {
    return (
      <div className="empty-state glass-panel">
        <div style={{ fontSize: "3rem" }}>⚖️</div>
        <h2>Comparador Vacío</h2>
        <p style={{ color: "var(--text-muted)" }}>
          Agrega países a la lista usando el botón de la báscula (⚖️) en cada tarjeta para compararlos.
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Comparando {listaComparacion.length} países</h2>
        <button className="btn-secondary" onClick={alLimpiarTodo}>
          Limpiar Todo
        </button>
      </div>

      <div className="compare-container">
        {listaComparacion.map((pais) => {
          // Cálculo simple de densidad de población (hab / km²)
          let densidad = "N/A";
          if (pais.area > 0) {
            densidad = (pais.poblacion / pais.area).toFixed(1);
          }

          return (
            <div key={pais.codigo} className="compare-card glass-panel">
              <button
                className="remove-compare-btn"
                onClick={() => alRemoverComparacion(pais.codigo)}
                title="Quitar"
              >
                ✕
              </button>

              <img
                src={pais.bandera}
                alt={pais.nombre}
                style={{ width: "80px", height: "54px", objectFit: "cover", borderRadius: "6px", marginBottom: "12px" }}
              />

              <h3 style={{ cursor: "pointer" }} onClick={() => alSeleccionarPais(pais)}>
                {pais.nombre}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "12px" }}>{pais.capital}</p>

              <div style={{ textAlign: "left", fontSize: "0.85rem", width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div><strong>Región:</strong> {pais.region}</div>
                <div><strong>Población:</strong> {formatearNumero(pais.poblacion)} hab.</div>
                <div><strong>Área:</strong> {formatearNumero(pais.area)} km²</div>
                <div><strong>Densidad:</strong> {densidad} hab/km²</div>
                <div><strong>Idiomas:</strong> {pais.idiomas}</div>
                <div><strong>Moneda:</strong> {pais.monedas}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
