import React from "react";

export function SearchBar({ search, setSearch, selectedRegion, setSelectedRegion, sortBy, setSortBy }) {
  return (
    <div className="controls-section">
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por país, capital o código (ej: Colombia, CA, Madrid)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="clear-btn" onClick={() => setSearch("")} title="Limpiar búsqueda">
            ✕
          </button>
        )}
      </div>

      <div className="filter-group">
        <select
          className="select-dropdown"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
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
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
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
