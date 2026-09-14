import React from "react";

// Componente para buscar y filtrar la lista de países
export function BarraBusqueda({ busqueda, setBusqueda, regionSeleccionada, setRegionSeleccionada, ordenarPor, setOrdenarPor }) {
  return (
    <div className="controls-section">
      {/* Campo de Texto para buscar */}
      <div className="search-box">
        <span className="search-icon">Buscar:</span>
        <input
          type="text"
          className="search-input"
          style={{ paddingLeft: "80px" }}
          placeholder="Escribe el nombre de un país o capital..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        {busqueda && (
          <button className="clear-btn" onClick={() => setBusqueda("")}>
            ✕
          </button>
        )}
      </div>

      {/* Selectores de Región y Ordenamiento */}
      <div className="filter-group">
        <select
          className="select-dropdown"
          value={regionSeleccionada}
          onChange={(e) => setRegionSeleccionada(e.target.value)}
        >
          <option value="todos">Todas las Regiones</option>
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
          <option value="nombre-asc">Nombre (A-Z)</option>
          <option value="nombre-desc">Nombre (Z-A)</option>
          <option value="poblacion-desc">Mayor Población</option>
          <option value="poblacion-asc">Menor Población</option>
          <option value="area-desc">Mayor Área (km²)</option>
        </select>
      </div>
    </div>
  );
}
