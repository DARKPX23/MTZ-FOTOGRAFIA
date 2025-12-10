// Año en el footer
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Lightbox refs
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxLocation = document.getElementById("lightbox-location");
const lightboxInfo = document.getElementById("lightbox-info");

// Crear galería desde photos.json (solo se ejecuta si existe gallery-grid)
async function createGallery() {
  const gallery = document.getElementById("gallery-grid");
  if (!gallery) return;

  try {
    const response = await fetch("photos.json");
    if (!response.ok) {
      throw new Error("No se pudo cargar photos.json");
    }

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
      figure.dataset.title = photo.title || `Foto ${index + 1}`;
      figure.dataset.location = photo.location || "";
      figure.dataset.info = photo.info || "";

      const img = document.createElement("img");
      // 🔥 anti-caché: fuerza a cargar siempre la versión más nueva
      img.src = `img/${photo.file}?v=${Date.now()}`;
      img.alt = photo.title || `Foto ${index + 1}`;
      img.loading = "lazy";

      const overlay = document.createElement("div");
      overlay.className = "gallery-overlay";

      const overlayInner = document.createElement("div");
      overlayInner.className = "gallery-overlay-inner";

      const left = document.createElement("div");
      const titleEl = document.createElement("div");
      titleEl.className = "gallery-overlay-title";
      titleEl.textContent = photo.title || `Foto ${index + 1}`;

      const locationEl = document.createElement("div");
      locationEl.style.fontSize = "0.7rem";
      locationEl.style.opacity = "0.8";
      locationEl.textContent = photo.location || "";

      left.appendChild(titleEl);
      if (photo.location) {
        left.appendChild(locationEl);
      }

      const tag = document.createElement("div");
      tag.className = "gallery-tag";
      tag.textContent = photo.tag || "Serie";

      overlayInner.appendChild(left);
      overlayInner.appendChild(tag);
      overlay.appendChild(overlayInner);

      figure.appendChild(img);
      figure.appendChild(overlay);
      gallery.appendChild(figure);
    });

    // después de crear, aplicamos animación y lightbox
    setupReveal();
    setupLightbox();
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

// Lightbox
function setupLightbox() {
  if (!lightbox) return;
  const items = document.querySelectorAll(".gallery-item");
  if (!items.length) return;

  items.forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      if (!img) return;

      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || "";
      lightboxTitle.textContent = item.dataset.title || "";
      lightboxLocation.textContent = item.dataset.location || "";
      lightboxInfo.textContent = item.dataset.info || "";
      lightbox.classList.add("active");
    });
  });
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("active");
  lightboxImg.src = "";
}

// cerrar al hacer clic fuera
if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

// cerrar con ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox && lightbox.classList.contains("active")) {
    closeLightbox();
  }
});

// Formulario demo (si existe)
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert(
      "Formulario de demostración.\n\nMás adelante se puede conectar a tu correo o WhatsApp."
    );
    this.reset();
  });
}

// Inicializar
window.addEventListener("DOMContentLoaded", () => {
  createGallery();
  setupReveal();
});
