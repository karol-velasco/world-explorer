import React, { useState, useEffect, useMemo } from "react";
import { fetchAllCountries } from "./services/countryService";
import { Navbar } from "./components/Navbar";
import { StatsOverview } from "./components/StatsOverview";
import { SearchBar } from "./components/SearchBar";
import { CountryCard } from "./components/CountryCard";
import { CountryModal } from "./components/CountryModal";
import { CountryCompare } from "./components/CountryCompare";

export function App() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & State
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const [activeTab, setActiveTab] = useState("all");

  // Selected for Modal
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Favorites & Compare state
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("world_explorer_favs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [compareList, setCompareList] = useState([]);

  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("world_explorer_theme") || "dark";
  });

  // Apply theme to body
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("world_explorer_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("world_explorer_favs", JSON.stringify(favorites));
    } catch (err) {
      console.error("Failed to save favorites to localStorage", err);
    }
  }, [favorites]);

  // Load countries on mount
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchAllCountries()
      .then((data) => {
        if (isMounted) {
          setCountries(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Error al cargar los datos de los países.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Quick lookup dictionary for cca3 -> country object
  const countriesMap = useMemo(() => {
    const map = {};
    countries.forEach((c) => {
      if (c.cca3) map[c.cca3] = c;
    });
    return map;
  }, [countries]);

  // Toggle Favorite
  const toggleFavorite = (cca3) => {
    setFavorites((prev) =>
      prev.includes(cca3) ? prev.filter((id) => id !== cca3) : [...prev, cca3]
    );
  };

  // Toggle Compare
  const toggleCompare = (cca3) => {
    setCompareList((prev) =>
      prev.includes(cca3) ? prev.filter((id) => id !== cca3) : [...prev, cca3]
    );
  };

  // Filtered & Sorted countries list
  const processedCountries = useMemo(() => {
    let list = countries;

    // Filter by tab
    if (activeTab === "favorites") {
      list = list.filter((c) => favorites.includes(c.cca3));
    }

    // Filter by region
    if (selectedRegion !== "all") {
      list = list.filter((c) => c.region === selectedRegion);
    }

    // Filter by search query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((c) => {
        const name = (c.spanishName || c.name).toLowerCase();
        const origName = c.name.toLowerCase();
        const capital = c.capital.toLowerCase();
        const cca3 = c.cca3.toLowerCase();
        const cca2 = c.cca2.toLowerCase();
        return (
          name.includes(q) ||
          origName.includes(q) ||
          capital.includes(q) ||
          cca3.includes(q) ||
          cca2.includes(q)
        );
      });
    }

    // Sorting
    return [...list].sort((a, b) => {
      if (sortBy === "name-asc") {
        return (a.spanishName || a.name).localeCompare(b.spanishName || b.name, "es");
      }
      if (sortBy === "name-desc") {
        return (b.spanishName || b.name).localeCompare(a.spanishName || a.name, "es");
      }
      if (sortBy === "pop-desc") {
        return b.population - a.population;
      }
      if (sortBy === "pop-asc") {
        return a.population - b.population;
      }
      if (sortBy === "area-desc") {
        return b.area - a.area;
      }
      return 0;
    });
  }, [countries, activeTab, favorites, selectedRegion, search, sortBy]);

  // Aggregate stats
  const totalWorldPopulation = useMemo(() => {
    return countries.reduce((sum, c) => sum + c.population, 0);
  }, [countries]);

  const comparingCountriesObjects = useMemo(() => {
    return compareList.map((code) => countriesMap[code]).filter(Boolean);
  }, [compareList, countriesMap]);

  return (
    <div className="app-layout">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        favCount={favorites.length}
        compareCount={compareList.length}
      />

      <main className="main-content">
        <StatsOverview
          totalCountries={countries.length}
          filteredCount={processedCountries.length}
          totalPopulation={totalWorldPopulation}
          favCount={favorites.length}
        />

        {activeTab === "compare" ? (
          <CountryCompare
            compareList={comparingCountriesObjects}
            onRemoveCompare={toggleCompare}
            onClearAll={() => setCompareList([])}
            onSelectCountry={(c) => setSelectedCountry(c)}
          />
        ) : (
          <>
            <SearchBar
              search={search}
              setSearch={setSearch}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            {loading && (
              <div className="loading-state glass-panel" style={{ borderRadius: "var(--radius-lg)" }}>
                <div className="spinner"></div>
                <h3>Cargando información geográfica del mundo...</h3>
                <p style={{ color: "var(--text-muted)" }}>Obteniendo datos de REST Countries API</p>
              </div>
            )}

            {error && (
              <div className="empty-state glass-panel" style={{ borderRadius: "var(--radius-lg)" }}>
                <div style={{ fontSize: "3rem" }}>⚠️</div>
                <h3>No se pudo cargar la información</h3>
                <p style={{ color: "var(--danger-color)" }}>{error}</p>
                <button className="btn-primary" onClick={() => window.location.reload()}>
                  Reintentar
                </button>
              </div>
            )}

            {!loading && !error && processedCountries.length === 0 && (
              <div className="empty-state glass-panel" style={{ borderRadius: "var(--radius-lg)" }}>
                <div style={{ fontSize: "3rem" }}>🔍</div>
                <h3>No se encontraron países</h3>
                <p style={{ color: "var(--text-muted)" }}>
                  {activeTab === "favorites"
                    ? "Aún no has guardado países en tus favoritos. Haz clic en el ícono ⭐ de cualquier tarjeta."
                    : "Intenta cambiar los términos de búsqueda o el filtro de región."}
                </p>
                {search && (
                  <button className="btn-secondary" onClick={() => setSearch("")}>
                    Limpiar Búsqueda
                  </button>
                )}
              </div>
            )}

            {!loading && !error && processedCountries.length > 0 && (
              <div className="countries-grid">
                {processedCountries.map((country) => (
                  <CountryCard
                    key={country.cca3 || country.name}
                    country={country}
                    onSelect={(c) => setSelectedCountry(c)}
                    isFavorite={favorites.includes(country.cca3)}
                    onToggleFavorite={toggleFavorite}
                    isComparing={compareList.includes(country.cca3)}
                    onToggleCompare={toggleCompare}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <CountryModal
        country={selectedCountry}
        onClose={() => setSelectedCountry(null)}
        isFavorite={selectedCountry ? favorites.includes(selectedCountry.cca3) : false}
        onToggleFavorite={toggleFavorite}
        isComparing={selectedCountry ? compareList.includes(selectedCountry.cca3) : false}
        onToggleCompare={toggleCompare}
        allCountriesMap={countriesMap}
        onSelectBorder={(borderCountry) => setSelectedCountry(borderCountry)}
      />

      <footer className="footer">
        World Explorer &copy; {new Date().getFullYear()} — Desarrollado con React 19 & REST Countries API
      </footer>
    </div>
  );
}

export default App;