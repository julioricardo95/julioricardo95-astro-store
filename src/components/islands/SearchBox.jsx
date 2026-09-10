import React, { useState, useEffect, useRef } from 'react';
import productsData from '../../data/products.json';

export default function SearchBox({ initialProducts = productsData }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [products] = useState(initialProducts);
  const containerRef = useRef(null);

  // Normalización defensiva por si el JSON tiene estructura encapsulada
  const rawProducts = Array.isArray(products) ? products : products?.products || [];

  // Filtrado de productos en tiempo real
  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length > 0) {
      const filtered = rawProducts.filter((product) => {
        const titleMatch = product.TITULO?.toLowerCase().includes(trimmed);
        const categoryMatch = product.CATEGORIA?.toLowerCase().includes(trimmed);
        const descriptionMatch = product.DESCRIPCION?.toLowerCase().includes(trimmed);
        return titleMatch || categoryMatch || descriptionMatch;
      });
      setResults(filtered.slice(0, 5));
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query, rawProducts]);

  // Cerrar el menú desplegable al hacer clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/productos?search=${encodeURIComponent(query.trim())}`;
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md group">
      
      {/* FORMULARIO DE BÚSQUEDA */}
      <form onSubmit={handleSearch} className="relative flex items-center">
        <div className="relative flex-grow">
          
          {/* Ícono Lupa Animado */}
          <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors text-sm pointer-events-none" />

          {/* Campo de Texto */}
          <input
            type="text"
            placeholder="Buscar productos, categorías..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setShowResults(true)}
            className="w-full pl-10 pr-9 py-2.5 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200/80 focus:border-primary-500 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/15 text-xs sm:text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 shadow-2xs"
          />

          {/* Botón de Limpiar (X) */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200/80 hover:bg-gray-300 text-gray-600 flex items-center justify-center text-xs transition-all active:scale-90"
              title="Limpiar búsqueda"
            >
              <i className="fas fa-times text-[10px]" />
            </button>
          )}
        </div>

        {/* Botón Enviar Formulario */}
        <button
          type="submit"
          className="ml-2 px-3.5 sm:px-4 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white font-semibold text-xs sm:text-sm rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-center shrink-0"
          aria-label="Buscar"
        >
          <i className="fas fa-arrow-right text-xs" />
        </button>
      </form>

      {/* MENÚ DESPLEGABLE DE RESULTADOS EN TIEMPO REAL */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in">
          {results.length > 0 ? (
            <>
              {/* Encabezado del desplegable */}
              <div className="px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <span>Coincidencias</span>
                <span className="text-primary-600 font-extrabold">{results.length} sugerencias</span>
              </div>

              {/* Lista de productos */}
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {results.map((product, index) => {
                  const productId = product.id || product.ID || index;
                  const imageUrl = Array.isArray(product.IMG) && product.IMG.length > 0
                    ? product.IMG[0]
                    : (typeof product.IMG === 'string' ? product.IMG : 'https://via.placeholder.com/80?text=Sin+Imagen');

                  return (
                    <a
                      key={productId}
                      href={`/producto/${productId}`}
                      className="flex items-center gap-3 p-3 hover:bg-primary-50/40 transition-colors group/item"
                    >
                      {/* Miniatura de la imagen */}
                      <div className="w-11 h-11 rounded-xl bg-gray-100 overflow-hidden border border-gray-100 shrink-0 relative">
                        <img
                          src={imageUrl}
                          alt={product.TITULO || 'Producto'}
                          className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>

                      {/* Detalles del producto */}
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-gray-900 text-xs sm:text-sm truncate group-hover/item:text-primary-600 transition-colors">
                          {product.TITULO || 'Sin título'}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-0.5">
                          {product.CATEGORIA && (
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 group-hover/item:bg-primary-100 group-hover/item:text-primary-700 transition-colors">
                              {product.CATEGORIA}
                            </span>
                          )}
                          <span className="font-extrabold text-xs text-gray-900">
                            ${product.PRECIO ?? '0.00'}
                          </span>
                        </div>
                      </div>

                      {/* Flecha indicadora */}
                      <i className="fas fa-chevron-right text-xs text-gray-300 group-hover/item:text-primary-500 group-hover/item:translate-x-1 transition-all mr-1" />
                    </a>
                  );
                })}
              </div>

              {/* Botón "Ver todos los resultados" */}
              <a
                href={`/productos?search=${encodeURIComponent(query.trim())}`}
                className="block p-3 text-center text-xs font-bold text-primary-600 bg-primary-50/40 hover:bg-primary-100/60 transition-colors border-t border-gray-100"
              >
                Ver todos los resultados para "{query}" <i className="fas fa-arrow-right ml-1 text-[10px]" />
              </a>
            </>
          ) : (
            /* Estado cuando no existen coincidencias */
            <div className="p-6 text-center">
              <div className="w-10 h-10 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-2">
                <i className="fas fa-search text-sm" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-gray-800">Sin resultados disponibles</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Intenta buscando por categoría o con otras palabras clave.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}