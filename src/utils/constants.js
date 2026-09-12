// Site Configuration
export const SITE_CONFIG = {
  name: "FixStore",
  title: "FixStore – Innovación para tu día a día",
  description: "Encuentra en FixStore lo último en tecnología, moda y accesorios. Envíos rápidos, garantía de calidad y ofertas exclusivas. ¡Compra online hoy!.",
  siteUrl: "https://julioricardo95-astro-store.pages.dev",
  url: "https://julioricardo95-astro-store.pages.dev/",
  author: "julioricardo95",
  email: "julioricardo95@gmail.com",
  phone: "+50558567432",
  // Formato numérico limpio sin '+' ni espacios para la API de WhatsApp (wa.me/50558567432)
  whatsapp: "50558567432", 
  address: {
    street: "Calle Principal",
    city: "Boaco",
    state: "Boaco", 
    zip: "12345",
    country: "Nicaragua"
  },
  social: {
    facebook: "https://www.facebook.com/julio.gutierrezjarquin",
    instagram: "https://www.instagram.com/julioricardo_95", 
    twitter: "https://x.com/julioricardo_95"
  },
  geo: {
    latitude: "12.4678",
    longitude: "-85.6589"
  }
};

// SEO Defaults
export const SEO_DEFAULTS = {
  keywords: "FixStore, comprar tecnología online, moda y accesorios, gadgets tecnológicos, smartphones libres, laptops, auriculares bluetooth, ropa de calidad, zapatos de calidad, publicidad, refacciones, envíos rápidos, productos premium",
  ogImage: "https://images.pexels.com/photos/3768894/pexels-photo-3768894.jpeg",
  twitterCard: "summary_large_image",
  robots: "index, follow"
};

// Categories
export const CATEGORIES = {
  TECNOLOGIA: "Tecnología",
  PUBLICIDAD: "Publicidad", 
  ACCESORIOS: "Accesorios",
  ELECTRONICA: "Electrónica Y Repuestos",
};

// Pagination & UI Constants
export const PAGINATION = {
  PRODUCTS_PER_PAGE: 8,
  ARTICLES_PER_PAGE: 6,
  CAROUSEL_AUTOPLAY_DELAY: 4000
};