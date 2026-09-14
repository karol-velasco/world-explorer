/**
 * Country Data Service for World Explorer
 * Handles fetching, fallback dataset, normalization, and lookup helpers.
 */

const BACKUP_DATASET_URL = "https://raw.githubusercontent.com/mledoze/countries/master/countries.json";
const LIVE_API_URL = "https://restcountries.com/v3.1/all";

/**
 * Normalizes raw country objects from REST Countries API or mledoze GitHub dataset
 */
export function normalizeCountry(raw) {
  const nameCommon = raw.name?.common || (typeof raw.name === "string" ? raw.name : "Desconocido");
  const nameOfficial = raw.name?.official || nameCommon;
  const spanishName = raw.translations?.spa?.common || nameCommon;
  const spanishOfficial = raw.translations?.spa?.official || nameOfficial;

  // Code
  const cca3 = raw.cca3 || raw.cioc || raw.cca2 || "";
  const cca2 = raw.cca2 || "";

  // Flags & Coat of Arms
  const flagSvg = raw.flags?.svg || raw.flags?.png || `https://flagcdn.com/w320/${cca2.toLowerCase()}.png`;
  const flagPng = raw.flags?.png || raw.flags?.svg || `https://flagcdn.com/w320/${cca2.toLowerCase()}.png`;
  const coatOfArms = raw.coatOfArms?.svg || raw.coatOfArms?.png || null;

  // Capital
  let capital = "N/A";
  if (Array.isArray(raw.capital) && raw.capital.length > 0) {
    capital = raw.capital.join(", ");
  } else if (typeof raw.capital === "string") {
    capital = raw.capital;
  }

  // Currencies
  let currenciesStr = "N/A";
  let currenciesList = [];
  if (raw.currencies && typeof raw.currencies === "object") {
    currenciesList = Object.entries(raw.currencies).map(([code, val]) => {
      const name = val?.name || code;
      const symbol = val?.symbol ? ` (${val.symbol})` : "";
      return `${name}${symbol}`;
    });
    currenciesStr = currenciesList.join(", ") || "N/A";
  }

  // Languages
  let languagesStr = "N/A";
  let languagesList = [];
  if (raw.languages && typeof raw.languages === "object") {
    languagesList = Object.values(raw.languages);
    languagesStr = languagesList.join(", ") || "N/A";
  }

  // Borders
  const borders = Array.isArray(raw.borders) ? raw.borders : [];

  // Lat / Lng
  const latlng = Array.isArray(raw.latlng) ? raw.latlng : [0, 0];
  const mapsUrl = raw.maps?.googleMaps || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nameCommon)}`;

  return {
    cca3,
    cca2,
    name: nameCommon,
    officialName: nameOfficial,
    spanishName,
    spanishOfficial,
    capital,
    region: raw.region || "Otros",
    subregion: raw.subregion || raw.region || "Sin subregión",
    population: Number(raw.population) || 0,
    area: Number(raw.area) || 0,
    flagSvg,
    flagPng,
    flagEmoji: raw.flag || "🏳️",
    coatOfArms,
    currenciesStr,
    currenciesList,
    languagesStr,
    languagesList,
    borders,
    latlng,
    mapsUrl,
    demonym: raw.demonyms?.eng?.m || raw.demonym || "N/A",
    landlocked: !!raw.landlocked,
    independent: raw.independent !== undefined ? raw.independent : true,
    unMember: raw.unMember !== undefined ? raw.unMember : true
  };
}

/**
 * Main fetch function: attempts live REST Countries API, falls back to raw dataset seamlessly
 */
export async function fetchAllCountries() {
  try {
    const res = await fetch(LIVE_API_URL);
    if (!res.ok) throw new Error(`API response HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data.map(normalizeCountry);
    }
    throw new Error("Invalid API payload");
  } catch (err) {
    console.warn("Live API fallback triggered due to:", err.message);
    // Fallback to complete GitHub JSON dataset
    const backupRes = await fetch(BACKUP_DATASET_URL);
    if (!backupRes.ok) throw new Error("Fallback dataset fetch failed");
    const backupData = await backupRes.json();
    return backupData.map(normalizeCountry);
  }
}

/**
 * Format population and area numbers nicely (e.g. 50,000,000)
 */
export function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return "0";
  return new Intl.NumberFormat("es-CO").format(num);
}
