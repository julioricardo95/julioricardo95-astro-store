// Site Configuration
export const SITE_CONFIG = {
  name: "TuTienda",
  title: "TuTienda - Productos Premium Online",
  description: "Tienda online moderna con los mejores productos de tecnología, moda y accesorios. Calidad garantizada y envíos rápidos.",
  siteUrl: "https://julioricardo95-astro-store.pages.dev",
  url: "https://julioricardo95-astro-store.pages.dev/",
  author: "julioricardo95",
  email: "julioricardo95@gmail.com",
  phone: "+505 5856 7432",
  // Formato numérico limpio sin '+' ni espacios para la API de WhatsApp (wa.me/50558567432)
  whatsapp: "50558567432", 
  address: {
    street: "Calle Principal 123",
    city: "Ciudad",
    state: "Estado", 
    zip: "12345",
    country: "Nicaragua"
  },
  social: {
    facebook: "https://facebook.com/tutienda",
    instagram: "https://instagram.com/tutienda", 
    twitter: "https://twitter.com/tutienda"
  },
  geo: {
    latitude: "12.4678",
    longitude: "-85.6589"
  }
};

// SEO Defaults
export const SEO_DEFAULTS = {
  keywords: "tienda online, tecnología, moda, accesorios, productos premium, calidad garantizada, envío rápido, smartphone, laptop, auriculares, vestidos, zapatos",
  ogImage: "https://images.pexels.com/photos/3768894/pexels-photo-3768894.jpeg",
  twitterCard: "summary_large_image",
  robots: "index, follow"
};

// Categories
export const CATEGORIES = {
  TECNOLOGIA: "Tecnología",
  MODA: "Moda", 
  ACCESORIOS: "Accesorios"
};

// Pagination & UI Constants
export const PAGINATION = {
  PRODUCTS_PER_PAGE: 8,
  ARTICLES_PER_PAGE: 6,
  CAROUSEL_AUTOPLAY_DELAY: 4000
};