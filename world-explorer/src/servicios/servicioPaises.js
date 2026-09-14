// =========================================================
// SERVICIO DE PAÍSES (NIVEL PRINCIPIANTE)
// Este archivo se encarga de descargar la información de los países.
// =========================================================

// Enlaces de donde descargamos la información de los países
const URL_DR5HN = "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json/countries.json";
const URL_MLEDOZE = "https://raw.githubusercontent.com/mledoze/countries/master/countries.json";

// Función principal para obtener la lista de países organizada
export async function obtenerPaises() {
  try {
    // 1. Descargamos los datos de población desde el primer servidor
    const respuestaPoblacion = await fetch(URL_DR5HN);
    const datosPoblacion = await respuestaPoblacion.json();

    // Guardamos la población de cada país en un objeto sencillo usando su código (ej: "COL" -> 53057212)
    const mapaPoblacion = {};
    for (let i = 0; i < datosPoblacion.length; i++) {
      const item = datosPoblacion[i];
      if (item.iso3) {
        mapaPoblacion[item.iso3] = item.population;
      }
    }

    // 2. Descargamos los datos principales (banderas, capitales, idiomas) del segundo servidor
    const respuestaPaises = await fetch(URL_MLEDOZE);
    const listaRaw = await respuestaPaises.json();

    // 3. Transformamos cada país a una estructura súper fácil de entender
    const listaPaisesFinal = [];

    for (let i = 0; i < listaRaw.length; i++) {
      const p = listaRaw[i];

      // Código del país (ej: COL, ESP, MEX)
      const codigo = p.cca3 || p.cca2 || "S/N";
      const codigoDosLetras = (p.cca2 || "").toLowerCase();

      // Nombres del país
      const nombreIngles = p.name?.common || "Desconocido";
      const nombreEspanol = p.translations?.spa?.common || nombreIngles;
      const nombreOficial = p.translations?.spa?.official || nombreIngles;

      // Capital (si tiene varias, tomamos la primera o ponemos 'No tiene')
      let capital = "Sin capital";
      if (p.capital && p.capital.length > 0) {
        capital = p.capital[0];
      }

      // Población (si no viene en el archivo principal, la sacamos del mapa de población)
      let poblacion = p.population;
      if (!poblacion && mapaPoblacion[codigo]) {
        poblacion = mapaPoblacion[codigo];
      }
      if (!poblacion) {
        poblacion = 0; // Si no hay datos, ponemos 0
      }

      // Superficie / Área en km²
      const area = p.area || 0;

      // Región y Subregión (ej: Americas, Europe)
      const region = p.region || "Otros";
      const subregion = p.subregion || region;

      // Imagen de la bandera
      const bandera = p.flags?.png || `https://flagcdn.com/w320/${codigoDosLetras}.png`;

      // Escudo de armas
      const escudo = p.coatOfArms?.png || null;

      // Idiomas (los unimos con comas)
      let idiomas = "No especificado";
      if (p.languages) {
        idiomas = Object.values(p.languages).join(", ");
      }

      // Monedas (las unimos con comas)
      let monedas = "No especificado";
      if (p.currencies) {
        const listaMonedas = [];
        const llaves = Object.keys(p.currencies);
        for (let j = 0; j < llaves.length; j++) {
          const m = p.currencies[llaves[j]];
          listaMonedas.push(m.name || llaves[j]);
        }
        monedas = listaMonedas.join(", ");
      }

      // Fronteras (lista de códigos de países vecinos)
      const fronteras = p.borders || [];

      // Creamos el objeto limpio de este país
      const objetoPais = {
        codigo: codigo,
        codigoDosLetras: codigoDosLetras,
        nombre: nombreEspanol,
        nombreOriginal: nombreIngles,
        nombreOficial: nombreOficial,
        capital: capital,
        poblacion: poblacion,
        area: area,
        region: region,
        subregion: subregion,
        bandera: bandera,
        escudo: escudo,
        idiomas: idiomas,
        monedas: monedas,
        fronteras: fronteras,
        sinSalidaMar: p.landlocked ? true : false,
        miembroOnu: p.unMember ? true : false
      };

      listaPaisesFinal.push(objetoPais);
    }

    return listaPaisesFinal;
  } catch (error) {
    console.error("Ocurrió un error al cargar los países:", error);
    return [];
  }
}

// Función sencilla para formatear números largos (ej: 50000000 -> 50.000.000)
export function formatearNumero(numero) {
  if (!numero) return "0";
  return numero.toLocaleString("es-CO");
}
