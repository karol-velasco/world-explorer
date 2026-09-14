import React from "react";

export function BarraBusqueda({ busqueda, setBusqueda, regionSeleccionada, setRegionSeleccionada, ordenarPor, setOrdenarPor }) {
  return (
    <div className="controls-section">
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por país, capital o código (ej: Colombia, CA, Madrid)..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        {busqueda && (
          <button className="clear-btn" onClick={() => setBusqueda("")} title="Limpiar búsqueda">
            ✕
          </button>
        )}
      </div>

      <div className="filter-group">
        <select
          className="select-dropdown"
          value={regionSeleccionada}
          onChange={(e) => setRegionSeleccionada(e.target.value)}
        >
          <option value="all">Todas las Regiones</option>
          <option value="Americas">América</option>
          <option value="Europe">Europa</option>
          <option value="Asia">Asia</option>
          <option value="Africa">África</option>
          <option value="Oceania">Oceanía</option>
          <option value="Antarctic">Antártida</option>
        </select>

        <select
          className="select-dropdown"
          value={ordenarPor}
          onChange={(e) => setOrdenarPor(e.target.value)}
        >
          <option value="name-asc">Nombre (A-Z)</option>
          <option value="name-desc">Nombre (Z-A)</option>
          <option value="pop-desc">Mayor Población</option>
          <option value="pop-asc">Menor Población</option>
          <option value="area-desc">Mayor Área (km²)</option>
        </select>
      </div>
    </div>
  );
}
