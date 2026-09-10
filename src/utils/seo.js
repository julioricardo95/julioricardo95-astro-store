import { SITE_CONFIG, SEO_DEFAULTS } from './constants.js';

// Generate structured data for Organization
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SITE_CONFIG.name,
    "alternateName": SITE_CONFIG.name,
    "description": SITE_CONFIG.description,
    "url": SITE_CONFIG.url,
    "logo": `${SITE_CONFIG.url}/favicon.svg`,
    "image": SEO_DEFAULTS.ogImage,
    "telephone": SITE_CONFIG.phone,
    "email": SITE_CONFIG.email,
    "foundingDate": "2024",
    "numberOfEmployees": "10-50",
    "priceRange": "$",
    "paymentAccepted": ["Cash", "Credit Card", "PayPal"],
    "currenciesAccepted": "USD",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": SITE_CONFIG.address.street,
      "addressLocality": SITE_CONFIG.address.city,
      "addressRegion": SITE_CONFIG.address.state,
      "postalCode": SITE_CONFIG.address.zip,
      "addressCountry": SITE_CONFIG.address.country
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": SITE_CONFIG.geo.latitude,
      "longitude": SITE_CONFIG.geo.longitude
    },
    "sameAs": Object.values(SITE_CONFIG.social),
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": SITE_CONFIG.phone,
      "contactType": "customer service",
      "availableLanguage": ["Spanish", "English"]
    }
  };
}

// Generate structured data for Product
export function generateProductSchema(product) {
  // Asegura que el precio sea convertido a String y elimina el símbolo '$' u otros caracteres no numéricos
  const rawPrice = product?.PRECIO ?? '0';
  const cleanPrice = String(rawPrice).replace('$', '').trim();

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product?.TITULO || '',
    "image": product?.IMG || [],
    "description": product?.DESCRIPCION || '',
    "category": product?.CATEGORIA || '',
    "brand": {
      "@type": "Brand",
      "name": SITE_CONFIG.name
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": cleanPrice,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": SITE_CONFIG.name
      }
    }
  };
}

// Generate structured data for Article
export function generateArticleSchema(article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article?.title || '',
    "description": article?.excerpt || '',
    "image": article?.image || '',
    "author": {
      "@type": "Organization",
      "name": SITE_CONFIG.name
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_CONFIG.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_CONFIG.url}/favicon.svg`
      }
    },
    "datePublished": article?.date || '',
    "dateModified": article?.date || ''
  };
}

// Generate breadcrumb schema
export function generateBreadcrumbSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}