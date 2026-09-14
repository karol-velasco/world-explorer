import React, { useState, useEffect } from "react";
import { obtenerPaises } from "./servicios/servicioPaises";
import { BarraNavegacion } from "./componentes/BarraNavegacion";
import { ResumenEstadisticas } from "./componentes/ResumenEstadisticas";
import { BarraBusqueda } from "./componentes/BarraBusqueda";
import { TarjetaPais } from "./componentes/TarjetaPais";
import { ModalPais } from "./componentes/ModalPais";
import { ComparadorPaises } from "./componentes/ComparadorPaises";

export function App() {
  // 1. ESTADOS PRINCIPALES DE LA APLICACIÓN
  const [paises, setPaises] = useState([]); // Lista completa de países descargados
  const [cargando, setCargando] = useState(true); // Control de pantalla de carga

  // Estados para filtros
  const [busqueda, setBusqueda] = useState("");
  const [regionSeleccionada, setRegionSeleccionada] = useState("todos");
  const [ordenarPor, setOrdenarPor] = useState("nombre-asc");
  const [pestanaActiva, setPestanaActiva] = useState("todos");

  // Estado para el modal de detalle del país seleccionado
  const [paisSeleccionado, setPaisSeleccionado] = useState(null);

  // Estado para guardar códigos de países favoritos (ej: ["COL", "ESP"])
  const [favoritos, setFavoritos] = useState(() => {
    const guardados = localStorage.getItem("favoritos_paises");
    if (guardados) {
      return JSON.parse(guardados);
    }
    return [];
  });

  // Estado para comparar países
  const [comparacion, setComparacion] = useState([]);

  // Estado para el Tema Oscuro / Claro
  const [tema, setTema] = useState("dark");

  // 2. EFECTO: Cambiar la apariencia entre claro u oscuro
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
  }, [tema]);

  // 3. EFECTO: Guardar favoritos en la memoria del navegador
  useEffect(() => {
    localStorage.setItem("favoritos_paises", JSON.stringify(favoritos));
  }, [favoritos]);

  // 4. EFECTO: Descargar los países al abrir la página
  useEffect(() => {
    async function cargarDatos() {
      setCargando(true);
      const lista = await obtenerPaises();
      setPaises(lista);
      setCargando(false);
    }

    cargarDatos();
  }, []);

  // 5. FUNCIONES PARA MANEJAR FAVORITOS Y COMPARACIÓN
  const alternarFavorito = (codigo) => {
    if (favoritos.includes(codigo)) {
      // Si ya está, lo quitamos
      const nuevaLista = favoritos.filter((c) => c !== codigo);
      setFavoritos(nuevaLista);
    } else {
      // Si no está, lo agregamos
      setFavoritos([...favoritos, codigo]);
    }
  };

  const alternarComparar = (codigo) => {
    if (comparacion.includes(codigo)) {
      setComparacion(comparacion.filter((c) => c !== codigo));
    } else {
      setComparacion([...comparacion, codigo]);
    }
  };

  const alternarTema = () => {
    if (tema === "dark") {
      setTema("light");
    } else {
      setTema("dark");
    }
  };

  // 6. MAPA DE BÚSQUEDA RÁPIDA (para encontrar un país por su código)
  const mapaPaises = {};
  for (let i = 0; i < paises.length; i++) {
    const p = paises[i];
    mapaPaises[p.codigo] = p;
  }

  // 7. FILTRAR Y ORDENAR PAÍSES DE MANERA SENCILLA
  let paisesFiltrados = paises;

  // Filtrar si estamos en la pestaña de Favoritos
  if (pestanaActiva === "favoritos") {
    paisesFiltrados = paisesFiltrados.filter((p) => favoritos.includes(p.codigo));
  }

  // Filtrar por Región / Continente
  if (regionSeleccionada !== "todos") {
    paisesFiltrados = paisesFiltrados.filter((p) => p.region === regionSeleccionada);
  }

  // Filtrar por Texto de búsqueda
  if (busqueda.trim() !== "") {
    const texto = busqueda.toLowerCase().trim();
    paisesFiltrados = paisesFiltrados.filter((p) => {
      const nomEspanol = p.nombre.toLowerCase();
      const nomIngles = p.nombreOriginal.toLowerCase();
      const capital = p.capital.toLowerCase();
      const cod = p.codigo.toLowerCase();
      return nomEspanol.includes(texto) || nomIngles.includes(texto) || capital.includes(texto) || cod.includes(texto);
    });
  }

  // Ordenar la lista según la opción elegida
  paisesFiltrados.sort((a, b) => {
    if (ordenarPor === "nombre-asc") {
      return a.nombre.localeCompare(b.nombre, "es");
    }
    if (ordenarPor === "nombre-desc") {
      return b.nombre.localeCompare(a.nombre, "es");
    }
    if (ordenarPor === "poblacion-desc") {
      return b.poblacion - a.poblacion;
    }
    if (ordenarPor === "poblacion-asc") {
      return a.poblacion - b.poblacion;
    }
    if (ordenarPor === "area-desc") {
      return b.area - a.area;
    }
    return 0;
  });

  // Calcular la suma de la población de los países mostrados
  let poblacionTotalSumada = 0;
  for (let i = 0; i < paises.length; i++) {
    poblacionTotalSumada += paises[i].poblacion;
  }

  // Crear la lista de objetos completos para comparar
  const listaComparacionObjetos = [];
  for (let i = 0; i < comparacion.length; i++) {
    const cod = comparacion[i];
    if (mapaPaises[cod]) {
      listaComparacionObjetos.push(mapaPaises[cod]);
    }
  }

  // 8. RENDERIZADO DEL COMPONENTE PRINCIPAL
  return (
    <div className="app-layout">
      {/* Barra Superior */}
      <BarraNavegacion
        pestanaActiva={pestanaActiva}
        setPestanaActiva={setPestanaActiva}
        tema={tema}
        alternarTema={alternarTema}
        conteoFavoritos={favoritos.length}
        conteoComparar={comparacion.length}
      />

      <main className="main-content">
        {/* Banner de Tarjetas Resumen */}
        <ResumenEstadisticas
          totalPaises={paises.length}
          conteoFiltrados={paisesFiltrados.length}
          poblacionTotal={poblacionTotalSumada}
          conteoFavoritos={favoritos.length}
        />

        {/* Vista de Comparación o Lista Principal */}
        {pestanaActiva === "comparar" ? (
          <ComparadorPaises
            listaComparacion={listaComparacionObjetos}
            alRemoverComparacion={alternarComparar}
            alLimpiarTodo={() => setComparacion([])}
            alSeleccionarPais={(p) => setPaisSeleccionado(p)}
          />
        ) : (
          <>
            {/* Controles de Búsqueda y Filtros */}
            <BarraBusqueda
              busqueda={busqueda}
              setBusqueda={setBusqueda}
              regionSeleccionada={regionSeleccionada}
              setRegionSeleccionada={setRegionSeleccionada}
              ordenarPor={ordenarPor}
              setOrdenarPor={setOrdenarPor}
            />

            {/* Mensaje de Carga */}
            {cargando && (
              <div className="loading-state glass-panel">
                <div className="spinner"></div>
                <h3>Cargando lista de países...</h3>
              </div>
            )}

            {/* Si no hay resultados */}
            {!cargando && paisesFiltrados.length === 0 && (
              <div className="empty-state glass-panel">
                <h3>No se encontraron países</h3>
                <p>Intenta cambiar la búsqueda o el filtro.</p>
              </div>
            )}

            {/* Grilla de Tarjetas de Países */}
            {!cargando && paisesFiltrados.length > 0 && (
              <div className="countries-grid">
                {paisesFiltrados.map((pais) => (
                  <TarjetaPais
                    key={pais.codigo}
                    pais={pais}
                    alSeleccionar={(p) => setPaisSeleccionado(p)}
                    esFavorito={favoritos.includes(pais.codigo)}
                    alAlternarFavorito={alternarFavorito}
                    estaComparando={comparacion.includes(pais.codigo)}
                    alAlternarComparar={alternarComparar}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Ventana Modal de Detalle */}
      <ModalPais
        pais={paisSeleccionado}
        alCerrar={() => setPaisSeleccionado(null)}
        esFavorito={paisSeleccionado ? favoritos.includes(paisSeleccionado.codigo) : false}
        alAlternarFavorito={alternarFavorito}
        estaComparando={paisSeleccionado ? comparacion.includes(paisSeleccionado.codigo) : false}
        alAlternarComparar={alternarComparar}
        mapaPaises={mapaPaises}
        alSeleccionarFrontera={(vecino) => setPaisSeleccionado(vecino)}
      />

      <footer className="footer">
        World Explorer — Proyecto de Aprendizaje React
      </footer>
    </div>
  );
}

export default App;