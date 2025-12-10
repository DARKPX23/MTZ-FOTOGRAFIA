// generate-photos-json.js
// Lee todos los archivos de la carpeta img/ y genera photos.json automáticamente.

const fs = require("fs");
const path = require("path");

// Carpeta de imágenes y archivo de salida
const IMAGES_DIR = path.join(__dirname, "img");
const OUTPUT_FILE = path.join(__dirname, "photos.json");

// Extensiones de imagen que vamos a considerar
const VALID_EXT = [".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG", ".PNG", ".WEBP"];

// Archivos que NO queremos que entren a la galería
const IGNORE = [
  "logo-zoe.png",  // tu logo
  "tu-foto.jpg"    // tu foto personal de contacto
  // Si tienes otros que no quieres mostrar, agrégalos aquí
  // ej: "icono.png"
];

function fileToTitle(filename) {
  // Quitar extensión
  const base = filename.replace(/\.[^/.]+$/, "");
  // Reemplazar _ y - por espacios
  const withSpaces = base.replace(/[-_]+/g, " ");
  // Poner mayúscula al inicio de cada palabra
  return withSpaces.replace(/\b\w/g, (c) => c.toUpperCase());
}

function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error("❌ No se encontró la carpeta img/");
    return;
  }

  const files = fs.readdirSync(IMAGES_DIR);

  const ignoreLower = IGNORE.map((name) => name.toLowerCase());

  const photos = files
    // Solo imágenes con extensión válida
    .filter((file) =>
      VALID_EXT.some((ext) => file.toLowerCase().endsWith(ext))
    )
    // Ignorar logo, foto personal, etc.
    .filter((file) => !ignoreLower.includes(file.toLowerCase()))
    // Convertir a objetos para photos.json
    .map((file) => ({
      file,                      // ej: "boda_zoe_01.jpg"
      title: fileToTitle(file),  // ej: "Boda Zoe 01"
      location: "",              // lo puedes editar después si quieres
      info: ""                   // descripción opcional
    }));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(photos, null, 2), "utf8");

  console.log(`✅ Generado photos.json con ${photos.length} fotos.`);
}

main();
