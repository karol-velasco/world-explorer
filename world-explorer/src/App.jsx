import React, { useState, useEffect, useMemo } from "react";
import { obtenerTodosLosPaises } from "./servicios/servicioPaises";
import { BarraNavegacion } from "./componentes/BarraNavegacion";
import { ResumenEstadisticas } from "./componentes/ResumenEstadisticas";
import { BarraBusqueda } from "./componentes/BarraBusqueda";
import { TarjetaPais } from "./componentes/TarjetaPais";
import { ModalPais } from "./componentes/ModalPais";
import { ComparadorPaises } from "./componentes/ComparadorPaises";

export function App() {
  const [paises, setPaises] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Filtros y Estados
  const [busqueda, setBusqueda] = useState("");
  const [regionSeleccionada, setRegionSeleccionada] = useState("all");
  const [ordenarPor, setOrdenarPor] = useState("name-asc");
  const [pestanaActiva, setPestanaActiva] = useState("todos");

  // Selección para Modal
  const [paisSeleccionado, setPaisSeleccionado] = useState(null);

  // Favoritos y Comparación
  const [favoritos, setFavoritos] = useState(() => {
    try {
      const guardados = localStorage.getItem("world_explorer_favs");
      return guardados ? JSON.parse(guardados) : [];
    } catch {
      return [];
    }
  });

  const [listaComparacion, setListaComparacion] = useState([]);

  // Tema Claro / Oscuro
  const [tema, setTema] = useState(() => {
    return localStorage.getItem("world_explorer_theme") || "dark";
  });

  // Aplicar tema al body
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
    localStorage.setItem("world_explorer_theme", tema);
  }, [tema]);

  const alternarTema = () => {
    setTema((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Guardar favoritos
  useEffect(() => {
    try {
      localStorage.setItem("world_explorer_favs", JSON.stringify(favoritos));
    } catch (err) {
      console.error("Error al guardar favoritos:", err);
    }
  }, [favoritos]);

  // Cargar países
  useEffect(() => {
    let estaMontado = true;
    setCargando(true);
    obtenerTodosLosPaises()
      .then((datos) => {
        if (estaMontado) {
          setPaises(datos);
          setCargando(false);
        }
      })
      .catch((err) => {
        if (estaMontado) {
          setError(err.message || "Error al cargar los datos de los países.");
          setCargando(false);
        }
      });

    return () => {
      estaMontado = false;
    };
  }, []);

  // Diccionario para búsqueda rápida por cca3
  const mapaPaises = useMemo(() => {
    const map = {};
    paises.forEach((p) => {
      if (p.cca3) map[p.cca3] = p;
    });
    return map;
  }, [paises]);

  // Alternar Favorito
  const alternarFavorito = (cca3) => {
    setFavoritos((prev) =>
      prev.includes(cca3) ? prev.filter((id) => id !== cca3) : [...prev, cca3]
    );
  };

  // Alternar Comparación
  const alternarComparar = (cca3) => {
    setListaComparacion((prev) =>
      prev.includes(cca3) ? prev.filter((id) => id !== cca3) : [...prev, cca3]
    );
  };

  // Lista de países filtrados y ordenados
  const paisesProcesados = useMemo(() => {
    let lista = paises;

    // Filtro por pestaña
    if (pestanaActiva === "favoritos") {
      lista = lista.filter((p) => favoritos.includes(p.cca3));
    }

    // Filtro por región
    if (regionSeleccionada !== "all") {
      lista = lista.filter((p) => p.region === regionSeleccionada);
    }

    // Filtro por término de búsqueda
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase().trim();
      lista = lista.filter((p) => {
        const nombre = (p.nombreEspanol || p.nombre).toLowerCase();
        const nomOrig = p.nombre.toLowerCase();
        const capital = p.capital.toLowerCase();
        const cca3 = p.cca3.toLowerCase();
        const cca2 = p.cca2.toLowerCase();
        return (
          nombre.includes(q) ||
          nomOrig.includes(q) ||
          capital.includes(q) ||
          cca3.includes(q) ||
          cca2.includes(q)
        );
      });
    }

    // Ordenamiento
    return [...lista].sort((a, b) => {
      if (ordenarPor === "name-asc") {
        return (a.nombreEspanol || a.nombre).localeCompare(b.nombreEspanol || b.nombre, "es");
      }
      if (ordenarPor === "name-desc") {
        return (b.nombreEspanol || b.nombre).localeCompare(a.nombreEspanol || a.nombre, "es");
      }
      if (ordenarPor === "pop-desc") {
        return b.poblacion - a.poblacion;
      }
      if (ordenarPor === "pop-asc") {
        return a.poblacion - b.poblacion;
      }
      if (ordenarPor === "area-desc") {
        return b.area - a.area;
      }
      return 0;
    });
  }, [paises, pestanaActiva, favoritos, regionSeleccionada, busqueda, ordenarPor]);

  // Población mundial total
  const poblacionMundialTotal = useMemo(() => {
    return paises.reduce((suma, p) => suma + p.poblacion, 0);
  }, [paises]);

  const objetosPaisesComparacion = useMemo(() => {
    return listaComparacion.map((codigo) => mapaPaises[codigo]).filter(Boolean);
  }, [listaComparacion, mapaPaises]);

  return (
    <div className="app-layout">
      <BarraNavegacion
        pestanaActiva={pestanaActiva}
        setPestanaActiva={setPestanaActiva}
        tema={tema}
        alternarTema={alternarTema}
        conteoFavoritos={favoritos.length}
        conteoComparar={listaComparacion.length}
      />

      <main className="main-content">
        <ResumenEstadisticas
          totalPaises={paises.length}
          conteoFiltrados={paisesProcesados.length}
          poblacionTotal={poblacionMundialTotal}
          conteoFavoritos={favoritos.length}
        />

        {pestanaActiva === "comparar" ? (
          <ComparadorPaises
            listaComparacion={objetosPaisesComparacion}
            alRemoverComparacion={alternarComparar}
            alLimpiarTodo={() => setListaComparacion([])}
            alSeleccionarPais={(p) => setPaisSeleccionado(p)}
          />
        ) : (
          <>
            <BarraBusqueda
              busqueda={busqueda}
              setBusqueda={setBusqueda}
              regionSeleccionada={regionSeleccionada}
              setRegionSeleccionada={setRegionSeleccionada}
              ordenarPor={ordenarPor}
              setOrdenarPor={setOrdenarPor}
            />

            {cargando && (
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

            {!cargando && !error && paisesProcesados.length === 0 && (
              <div className="empty-state glass-panel" style={{ borderRadius: "var(--radius-lg)" }}>
                <div style={{ fontSize: "3rem" }}>🔍</div>
                <h3>No se encontraron países</h3>
                <p style={{ color: "var(--text-muted)" }}>
                  {pestanaActiva === "favoritos"
                    ? "Aún no has guardado países en tus favoritos. Haz clic en el ícono ⭐ de cualquier tarjeta."
                    : "Intenta cambiar los términos de búsqueda o el filtro de región."}
                </p>
                {busqueda && (
                  <button className="btn-secondary" onClick={() => setBusqueda("")}>
                    Limpiar Búsqueda
                  </button>
                )}
              </div>
            )}

            {!cargando && !error && paisesProcesados.length > 0 && (
              <div className="countries-grid">
                {paisesProcesados.map((pais) => (
                  <TarjetaPais
                    key={pais.cca3 || pais.nombre}
                    pais={pais}
                    alSeleccionar={(p) => setPaisSeleccionado(p)}
                    esFavorito={favoritos.includes(pais.cca3)}
                    alAlternarFavorito={alternarFavorito}
                    estaComparando={listaComparacion.includes(pais.cca3)}
                    alAlternarComparar={alternarComparar}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <ModalPais
        pais={paisSeleccionado}
        alCerrar={() => setPaisSeleccionado(null)}
        esFavorito={paisSeleccionado ? favoritos.includes(paisSeleccionado.cca3) : false}
        alAlternarFavorito={alternarFavorito}
        estaComparando={paisSeleccionado ? listaComparacion.includes(paisSeleccionado.cca3) : false}
        alAlternarComparar={alternarComparar}
        mapaPaises={mapaPaises}
        alSeleccionarFrontera={(paisFrontera) => setPaisSeleccionado(paisFrontera)}
      />

      <footer className="footer">
        World Explorer &copy; {new Date().getFullYear()} — Desarrollado con React 19 & REST Countries API
      </footer>
    </div>
  );
}

export default App;