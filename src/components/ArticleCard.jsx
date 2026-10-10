/**
 * src/components/ArticleCard.jsx
 * Tarjeta de artículo para listas y secciones de blog (FixStore).
 * 
 * Optimizaciones:
 * - Diseño coherente con el sistema de tarjetas de la tienda (FixStore).
 * - Indicador de tiempo de lectura estimado (readTime).
 * - Botones de compartir integrados (WhatsApp, Facebook y copiar enlace).
 * - Efectos de hover suaves sin saltos de layout.
 */

import React, { useState } from 'react';

export default function ArticleCard({ article }) {
  const [copied, setCopied] = useState(false);

  const dateStr = article?.date
    ? new Date(article.date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : '';

  const imageUrl = article?.image || 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg';

  const handleFacebookShare = (e) => {
    e.stopPropagation();
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = encodeURIComponent(`${origin}/articulo/${article?.slug}`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const handleWhatsAppShare = (e) => {
    e.stopPropagation();
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/articulo/${article?.slug}`;
    const text = encodeURIComponent(`Te recomiendo este artículo de FixStore: "${article?.title}" 👉 ${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleCopyLink = async (e) => {
    e.stopPropagation();
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/articulo/${article?.slug}`;

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between h-full">
      {/* Contenedor de Imagen y Badge de Categoría */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 shrink-0">
        <img 
          src={imageUrl} 
          alt={article?.title || 'Artículo'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 opacity-60 pointer-events-none" />

        {/* Badge de Categoría */}
        {article?.category && (
          <div className="absolute top-3 left-3">
            <span className="backdrop-blur-md bg-white/90 text-gray-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-xs border border-white/40 tracking-wide uppercase">
              {article.category}
            </span>
          </div>
        )}
      </div>
      
      {/* Contenido del Artículo */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadatos (Fecha y Tiempo de Lectura) */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 mb-2">
            <span className="flex items-center">
              <i className="far fa-calendar-alt mr-1.5 text-primary-500" />
              {dateStr}
            </span>
            <span className="flex items-center">
              <i className="far fa-clock mr-1 text-primary-500" />
              {article?.readTime || '4 min'}
            </span>
          </div>
          
          {/* Título */}
          <h3 className="font-extrabold text-base sm:text-lg text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2 leading-snug">
            <a href={`/articulo/${article?.slug}`}>
              {article?.title || 'Sin título'}
            </a>
          </h3>
          
          {/* Extracto */}
          <p className="text-xs sm:text-sm text-gray-500 line-clamp-3 leading-relaxed mb-4">
            {article?.excerpt || 'Sin descripción disponible.'}
          </p>
        </div>
        
        {/* Acciones del pie de tarjeta */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <a 
            href={`/articulo/${article?.slug}`}
            className="inline-flex items-center text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors group/link"
          >
            <span>Leer artículo</span>
            <i className="fas fa-arrow-right ml-1.5 text-[10px] group-hover/link:translate-x-1 transition-transform" />
          </a>
          
          {/* Botones de Compartir */}
          <div className="flex items-center space-x-1">
            <button 
              type="button"
              onClick={handleWhatsAppShare}
              className="w-7 h-7 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 flex items-center justify-center transition-colors text-xs"
              title="Compartir en WhatsApp"
              aria-label="Compartir en WhatsApp"
            >
              <i className="fab fa-whatsapp" />
            </button>
            <button 
              type="button"
              onClick={handleFacebookShare}
              className="w-7 h-7 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-colors text-xs"
              title="Compartir en Facebook"
              aria-label="Compartir en Facebook"
            >
              <i className="fab fa-facebook-f" />
            </button>
            <button 
              type="button"
              onClick={handleCopyLink}
              className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors text-xs"
              title="Copiar enlace"
              aria-label="Copiar enlace"
            >
              <i className={`fas ${copied ? 'fa-check text-emerald-500' : 'fa-link'}`} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}