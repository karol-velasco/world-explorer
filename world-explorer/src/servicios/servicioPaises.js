/**
 * Servicio de Datos de Países para World Explorer
 * Gestiona la descarga, fusión de datos demográficos y normalización en español.
 */

const MLEDOZE_DATASET_URL = "https://raw.githubusercontent.com/mledoze/countries/master/countries.json";
const DR5HN_DATASET_URL = "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json/countries.json";
const LIVE_API_URL = "https://restcountries.com/v3.1/all";

/**
 * Normaliza objetos de países crudos de la API o datasets abiertos
 */
export function normalizarPais(raw, popMap = {}, areaMap = {}) {
  const cca3 = raw.cca3 || raw.cioc || raw.cca2 || raw.iso3 || "";
  const cca2 = raw.cca2 || raw.iso2 || "";

  const nombreComun = raw.name?.common || (typeof raw.name === "string" ? raw.name : "Desconocido");
  const nombreOficial = raw.name?.official || nombreComun;
  const nombreEspanol = raw.translations?.spa?.common || raw.translations?.es || nombreComun;
  const oficialEspanol = raw.translations?.spa?.official || nombreEspanol;

  // Banderas y Escudo
  const banderaSvg = raw.flags?.svg || raw.flags?.png || `https://flagcdn.com/w320/${cca2.toLowerCase()}.png`;
  const banderaPng = raw.flags?.png || raw.flags?.svg || `https://flagcdn.com/w320/${cca2.toLowerCase()}.png`;
  const escudo = raw.coatOfArms?.svg || raw.coatOfArms?.png || null;

  // Capital
  let capital = "N/A";
  if (Array.isArray(raw.capital) && raw.capital.length > 0) {
    capital = raw.capital.join(", ");
  } else if (typeof raw.capital === "string" && raw.capital.trim()) {
    capital = raw.capital;
  }

  // Monedas
  let monedasTexto = "N/A";
  let monedasLista = [];
  if (raw.currencies && typeof raw.currencies === "object") {
    monedasLista = Object.entries(raw.currencies).map(([codigo, val]) => {
      const nom = val?.name || codigo;
      const sim = val?.symbol ? ` (${val.symbol})` : "";
      return `${nom}${sim}`;
    });
    monedasTexto = monedasLista.join(", ") || "N/A";
  } else if (raw.currency_name) {
    const sim = raw.currency_symbol ? ` (${raw.currency_symbol})` : "";
    monedasTexto = `${raw.currency_name}${sim}`;
    monedasLista = [monedasTexto];
  }

  // Idiomas
  let idiomasTexto = "N/A";
  let idiomasLista = [];
  if (raw.languages && typeof raw.languages === "object") {
    idiomasLista = Object.values(raw.languages);
    idiomasTexto = idiomasLista.join(", ") || "N/A";
  }

  // Población y Área
  let poblacion = Number(raw.population) || 0;
  if (!poblacion && cca3 && popMap[cca3] !== undefined) {
    poblacion = Number(popMap[cca3]) || 0;
  }
  if (!poblacion && cca2 && popMap[cca2] !== undefined) {
    poblacion = Number(popMap[cca2]) || 0;
  }

  let area = Number(raw.area || raw.area_sq_km) || 0;
  if (!area && cca3 && areaMap[cca3] !== undefined) {
    area = Number(areaMap[cca3]) || 0;
  }

  // Fronteras
  const fronteras = Array.isArray(raw.borders) ? raw.borders : [];

  // Coordenadas
  const latlng = Array.isArray(raw.latlng)
    ? raw.latlng
    : [Number(raw.latitude) || 0, Number(raw.longitude) || 0];

  const mapaGoogleUrl = raw.maps?.googleMaps || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nombreEspanol || nombreComun)}`;

  return {
    cca3,
    cca2,
    nombre: nombreComun,
    nombreOficial,
    nombreEspanol,
    oficialEspanol,
    capital,
    region: raw.region || "Otros",
    subregion: raw.subregion || raw.region || "Sin subregión",
    poblacion,
    area,
    banderaSvg,
    banderaPng,
    banderaEmoji: raw.flag || raw.emoji || "🏳️",
    escudo,
    monedasTexto,
    monedasLista,
    idiomasTexto,
    idiomasLista,
    fronteras,
    latlng,
    mapaGoogleUrl,
    gentilicio: raw.demonyms?.eng?.m || raw.demonym || raw.nationality || "N/A",
    sinSalidaMar: !!raw.landlocked,
    independiente: raw.independent !== undefined ? raw.independent : true,
    miembroOnu: raw.unMember !== undefined ? raw.unMember : true
  };
}

/**
 * Función principal para obtener todos los países con datos fusionados de población
 */
export async function obtenerTodosLosPaises() {
  let popMap = {};
  let areaMap = {};
  try {
    const dr5hnRes = await fetch(DR5HN_DATASET_URL);
    if (dr5hnRes.ok) {
      const dr5hnData = await dr5hnRes.json();
      if (Array.isArray(dr5hnData)) {
        dr5hnData.forEach((item) => {
          if (item.iso3) {
            popMap[item.iso3] = item.population;
            areaMap[item.iso3] = item.area_sq_km;
          }
          if (item.iso2) {
            popMap[item.iso2] = item.population;
            areaMap[item.iso2] = item.area_sq_km;
          }
        });
      }
    }
  } catch (e) {
    console.warn("Advertencia al cargar dataset dr5hn:", e.message);
  }

  try {
    const res = await fetch(LIVE_API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0 && data[0].population !== undefined) {
      return data.map((item) => normalizarPais(item, popMap, areaMap));
    }
    throw new Error("Respuesta no válida de la API principal");
  } catch (err) {
    console.warn("Activando respaldo de datos por:", err.message);
    const backupRes = await fetch(MLEDOZE_DATASET_URL);
    if (!backupRes.ok) throw new Error("Fallo al obtener respaldo");
    const backupData = await backupRes.json();
    return backupData.map((item) => normalizarPais(item, popMap, areaMap));
  }
}

/**
 * Formatea números de población o superficie (ej: 50.057.212)
 */
export function formatearNumero(num) {
  if (num === null || num === undefined || isNaN(num)) return "0";
  return new Intl.NumberFormat("es-CO").format(num);
}
