import React from "react";
import { formatearNumero } from "../servicios/servicioPaises";

// Componente sencillo para mostrar la tarjeta de cada país
export function TarjetaPais({ pais, alSeleccionar, esFavorito, alAlternarFavorito, estaComparando, alAlternarComparar }) {
  return (
    <div className="country-card" onClick={() => alSeleccionar(pais)}>
      {/* Imagen de la bandera */}
      <div className="flag-container">
        <img
          src={pais.bandera}
          alt={`Bandera de ${pais.nombre}`}
          className="flag-img"
          loading="lazy"
        />

        {/* Botones rápidos arriba de la tarjeta */}
        <div className="card-top-actions" onClick={(e) => e.stopPropagation()}>
          {/* Botón de Favorito ⭐ */}
          <button
            className={`action-icon-btn ${esFavorito ? "active-fav" : ""}`}
            onClick={() => alAlternarFavorito(pais.codigo)}
            title="Guardar en favoritos"
          >
            {esFavorito ? "★" : "☆"}
          </button>

          {/* Botón de Comparar ⚖️ */}
          <button
            className={`action-icon-btn ${estaComparando ? "active-compare" : ""}`}
            onClick={() => alAlternarComparar(pais.codigo)}
            title="Añadir a comparación"
          >
            ⚖️
          </button>
        </div>
      </div>

      {/* Información principal */}
      <div className="card-content">
        <h3 className="country-title">{pais.nombre}</h3>
        <p className="country-subtitle">{pais.nombreOriginal}</p>

        <div className="card-details">
          <div className="detail-row">
            <span className="detail-label">Capital:</span>
            <span className="detail-val">{pais.capital}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Población:</span>
            <span className="detail-val">{formatearNumero(pais.poblacion)} hab.</span>
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
