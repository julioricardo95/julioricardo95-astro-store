import React from 'react';

// Importación de las constantes del sitio
import { SITE_CONFIG } from '../utils/constants.js';

/**
 * Componente ProductCard (Optimizado para Celular y Laptop)
 */
export default function ProductCard({ product }) {
  // Imagen por defecto si el array 'IMG' no está definido
  const imageUrl = product?.IMG?.[0] || 'https://via.placeholder.com/400x300?text=Sin+Imagen';

  // Contacto directo por WhatsApp
  const handleWhatsAppContact = () => {
    const text = encodeURIComponent(`Hola, estoy interesado en ${product?.TITULO || 'este producto'}`);
    window.open(`https://wa.me/${SITE_CONFIG.whatsapp}?text=${text}`, '_blank');
  };

  // Compartir en Facebook
  const handleFacebookShare = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : SITE_CONFIG.siteUrl;
    const url = encodeURIComponent(`${baseUrl}/producto/${product?.id}`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  // Realizar llamada
  const handlePhoneCall = () => {
    const cleanPhone = SITE_CONFIG.phone.replace(/\s+/g, '');
    window.open(`tel:${cleanPhone}`);
  };

  return (
    <div className="group bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between h-full">
      
      {/* --- CABECERA E IMAGEN --- */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 shrink-0">
        <img
          src={imageUrl}
          alt={product?.TITULO || 'Producto'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        
        {/* Degradado transparente sobre la imagen */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 opacity-60 pointer-events-none" />

        {/* Badge de Categoría (Ajustado para no desbordar en móvil) */}
        {product?.CATEGORIA && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 max-w-[80%]">
            <span className="backdrop-blur-md bg-white/85 text-gray-800 text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs border border-white/40 tracking-wide uppercase block truncate">
              {product.CATEGORIA}
            </span>
          </div>
        )}
      </div>

      {/* --- CUERPO DEL CARD --- */}
      <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between">
        
        {/* Información Básica */}
        <div>
          <h3 
            className="font-bold text-sm sm:text-lg text-gray-800 group-hover:text-primary-600 transition-colors line-clamp-1 mb-1" 
            title={product?.TITULO}
          >
            {product?.TITULO || 'Sin título'}
          </h3>

          <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-3 sm:mb-4">
            {product?.DESCRIPCION || 'Sin descripción disponible.'}
          </p>
        </div>

        {/* Precio y Acciones */}
        <div>
          {/* Fila del Precio y Botón Principal */}
          <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4 pt-2 border-t border-gray-50">
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs text-gray-400 block font-medium leading-none mb-0.5">Precio</span>
              <span className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight block truncate">
                ${product?.PRECIO ?? '0.00'}
              </span>
            </div>

            <a
              href={`/producto/${product?.id}`}
              className="inline-flex items-center justify-center bg-gray-900 hover:bg-primary-600 text-white text-xs sm:text-sm font-semibold px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl shadow-xs hover:shadow-md transition-all duration-200 active:scale-95 shrink-0"
            >
              Ver detalles
            </a>
          </div>

          {/* Botonera de Contacto Rápido */}
          <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-gray-100">
            <span className="text-[10px] sm:text-xs font-medium text-gray-400 truncate">Contacto rápido:</span>
            
            <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
              {/* WhatsApp */}
              <button
                onClick={handleWhatsAppContact}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-200 active:scale-90 shadow-2xs"
                title={`Contactar vía WhatsApp (${SITE_CONFIG.whatsapp})`}
                aria-label="WhatsApp"
              >
                <i className="fab fa-whatsapp text-sm sm:text-lg"></i>
              </button>

              {/* Facebook */}
              <button
                onClick={handleFacebookShare}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 active:scale-90 shadow-2xs"
                title="Compartir en Facebook"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f text-xs sm:text-base"></i>
              </button>

              {/* Llamada */}
              <button
                onClick={handlePhoneCall}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-800 hover:text-white transition-all duration-200 active:scale-90 shadow-2xs"
                title={`Llamar a ${SITE_CONFIG.phone}`}
                aria-label="Llamar"
              >
                <i className="fas fa-phone text-xs sm:text-sm"></i>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}