import React from "react";
import { formatearNumero } from "../servicios/servicioPaises";

export function TarjetaPais({ pais, alSeleccionar, esFavorito, alAlternarFavorito, estaComparando, alAlternarComparar }) {
  const nombreMostrar = pais.nombreEspanol || pais.nombre;

  return (
    <div className="country-card" onClick={() => alSeleccionar(pais)}>
      <div className="flag-container">
        <img
          src={pais.banderaPng}
          alt={`Bandera de ${nombreMostrar}`}
          className="flag-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://flagcdn.com/w320/${pais.cca2.toLowerCase()}.png`;
          }}
        />

        <div className="card-top-actions" onClick={(e) => e.stopPropagation()}>
          <button
            className={`action-icon-btn ${esFavorito ? "active-fav" : ""}`}
            onClick={() => alAlternarFavorito(pais.cca3)}
            title={esFavorito ? "Quitar de favoritos" : "Guardar en favoritos"}
          >
            {esFavorito ? "★" : "☆"}
          </button>
          <button
            className={`action-icon-btn ${estaComparando ? "active-compare" : ""}`}
            onClick={() => alAlternarComparar(pais.cca3)}
            title={estaComparando ? "Quitar de comparación" : "Añadir a comparación"}
          >
            ⚖️
          </button>
        </div>
      </div>

      <div className="card-content">
        <h3 className="country-title">{nombreMostrar}</h3>
        <p className="country-subtitle">{pais.nombre !== nombreMostrar ? pais.nombre : pais.nombreOficial}</p>

        <div className="card-details">
          <div className="detail-row">
            <span className="detail-label">Capital:</span>
            <span className="detail-val">{pais.capital}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Población:</span>
            <span className="detail-val">{formatearNumero(pais.poblacion)}</span>
          </div>

          <div className="detail-row" style={{ marginTop: "6px" }}>
            <span className="detail-label">Región:</span>
            <span className="region-badge">{pais.region}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
