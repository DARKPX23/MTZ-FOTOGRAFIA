// Año en el footer
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Crear galería desde photos.json (solo se ejecuta si existe gallery-grid)
async function createGallery() {
  const gallery = document.getElementById("gallery-grid");
  if (!gallery) return;

  try {
    const response = await fetch(`photos.json?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo cargar photos.json");

    const photos = await response.json();
    console.log("Fotos cargadas desde photos.json:", photos);

    // limpiar primero
    gallery.innerHTML = "";

    if (!Array.isArray(photos) || photos.length === 0) {
      gallery.innerHTML =
        "<p style='color:#888;font-size:0.9rem'>Aún no hay fotos en la galería.</p>";
      return;
    }

    photos.forEach((photo, index) => {
      const figure = document.createElement("figure");
      figure.className = "gallery-item";

      const img = document.createElement("img");
      // anti-caché para imágenes
      img.src = `img/${photo.file}?v=${Date.now()}`;
      img.alt = photo.title || `Foto ${index + 1}`;
      img.loading = "lazy";

      figure.appendChild(img);
      gallery.appendChild(figure);
    });

    // después de crear, aplicamos animación
    setupReveal();
  } catch (err) {
    console.error("Error cargando photos.json:", err);
    gallery.innerHTML =
      "<p style='color:#b00;font-size:0.9rem'>Hubo un problema al cargar la galería. Revisa que photos.json exista en la raíz y que tenga un JSON válido.</p>";
  }
}

// Animación reveal
function setupReveal() {
  const revealEls = document.querySelectorAll(".reveal, .gallery-item");
  if (!revealEls.length) return;

  if (!("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealEls.forEach((el) => observer.observe(el));
}

// Formulario → WhatsApp (si existe)
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = this.nombre?.value || "";
    const email = this.email?.value || "";
    const telefono = this.telefono?.value || "";
    const tipo = this.tipo?.value || "";
    const fecha = this.fecha?.value || "";
    const mensaje = this.mensaje?.value || "";

    const texto = [
      "Hola Zoe, quiero agendar una sesión:",
      nombre && `• Nombre: ${nombre}`,
      telefono && `• Teléfono: ${telefono}`,
      email && `• Correo: ${email}`,
      tipo && `• Tipo de sesión: ${tipo}`,
      fecha && `• Fecha aproximada: ${fecha}`,
      mensaje && `• Mensaje: ${mensaje}`,
    ]
      .filter(Boolean)
      .join("\n");

    const telefonoDestino = "522212029082"; // sin signos, solo números
    const url = `https://wa.me/${telefonoDestino}?text=${encodeURIComponent(texto)}`;

    window.open(url, "_blank");
    this.reset();
  });
}

// Inicializar
window.addEventListener("DOMContentLoaded", () => {
  createGallery();
  setupReveal();
});
