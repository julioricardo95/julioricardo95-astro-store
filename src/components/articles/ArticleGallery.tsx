/**
 * src/components/articles/ArticleGallery.tsx
 * Componente interactivo y reactivo en .tsx para la galería de artículos de FixStore (/articulos).
 * 
 * Funcionalidades y Mejoras:
 * - Filtro interactivo por pestañas de categoría en tiempo real con contador.
 * - Barra de búsqueda en vivo con botón para limpiar consulta.
 * - Selector de ordenamiento (Más recientes, Más antiguos, Alfabético).
 * - Sección de Artículo Destacado (Spotlight Hero) con diseño de alto impacto.
 * - Tarjetas interactivas con tiempo de lectura estimado, badge y botones de compartir (WhatsApp, Facebook, Enlace).
 * - Enlace directo a servicios y catálogo de la tienda para conversión comercial.
 */

import React, { useState, useMemo } from 'react';

export interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  image: string;
  excerpt: string;
  author?: string;
  readTime?: string;
  featured?: boolean;
}

interface ArticleGalleryProps {
  initialArticles: ArticleItem[];
  categories: string[];
}

export default function ArticleGallery({ initialArticles = [], categories = [] }: ArticleGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'title'>('recent');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Filtrado y ordenamiento computado en tiempo real
  const filteredArticles = useMemo(() => {
    let result = [...initialArticles];

    // 1. Filtrar por Categoría
    if (selectedCategory !== 'todos') {
      result = result.filter(
        (article) => article.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // 2. Filtrar por Búsqueda (Título, Excerpt o Categoría)
    const trimmed = searchQuery.trim().toLowerCase();
    if (trimmed) {
      result = result.filter((article) => {
        const titleMatch = article.title?.toLowerCase().includes(trimmed);
        const excerptMatch = article.excerpt?.toLowerCase().includes(trimmed);
        const catMatch = article.category?.toLowerCase().includes(trimmed);
        return titleMatch || excerptMatch || catMatch;
      });
    }

    // 3. Ordenar
    result.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }
      return 0;
    });

    return result;
  }, [initialArticles, selectedCategory, searchQuery, sortBy]);

  // Artículo Destacado: busca el marcado con featured o el más reciente
  const featuredArticle = useMemo(() => {
    if (initialArticles.length === 0) return null;
    return initialArticles.find((a) => a.featured) || initialArticles[0];
  }, [initialArticles]);

  // Compartir en WhatsApp
  const handleShareWhatsApp = (article: ArticleItem) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/articulo/${article.slug}`;
    const text = encodeURIComponent(`Te recomiendo leer: "${article.title}" en FixStore 👉 ${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Compartir en Facebook
  const handleShareFacebook = (article: ArticleItem) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = encodeURIComponent(`${origin}/articulo/${article.slug}`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  // Copiar Enlace al portapapeles o Web Share API
  const handleShareLink = async (article: ArticleItem) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/articulo/${article.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url
        });
        return;
      } catch {
        // Fallback a copiar al portapapeles
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopiedSlug(article.slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    }
  };

  return (
    <div className="space-y-12">
      
      {/* ========================================================
          1. ARTÍCULO DESTACADO (SPOTLIGHT BANNER)
          Solo visible si no hay filtro de búsqueda activo
      ======================================================== */}
      {!searchQuery && selectedCategory === 'todos' && featuredArticle && (
        <section aria-label="Artículo Destacado" className="animate-fade-in">
          <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-primary-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-gray-800/80 overflow-hidden relative group">
            
            {/* Efectos de Luz Ambiental */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Imagen del Destacado */}
              <div className="lg:col-span-6 overflow-hidden rounded-2xl aspect-[16/10] bg-gray-800 border border-gray-700/60 shadow-xl">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Contenido del Destacado */}
              <div className="lg:col-span-6 space-y-4">
                
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-primary-500 text-white shadow-xs">
                    ★ Destacado
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-gray-300 border border-white/10 backdrop-blur-md">
                    {featuredArticle.category}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center">
                    <i className="far fa-clock mr-1 text-[11px]"></i>
                    {featuredArticle.readTime || '5 min de lectura'}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug hover:text-primary-400 transition-colors">
                  <a href={`/articulo/${featuredArticle.slug}`}>
                    {featuredArticle.title}
                  </a>
                </h2>

                <p className="text-sm sm:text-base text-gray-300 leading-relaxed line-clamp-3">
                  {featuredArticle.excerpt}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <a
                    href={`/articulo/${featuredArticle.slug}`}
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold shadow-md hover:shadow-xl transition-all duration-200 active:scale-95"
                  >
                    <span>Leer Artículo Completo</span>
                    <i className="fas fa-arrow-right ml-2.5 text-xs"></i>
                  </a>

                  <span className="text-xs text-gray-400">
                    Publicado el {new Date(featuredArticle.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>

              </div>

            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          2. BARRA DE CONTROLES: BÚSQUEDA, CATEGORÍAS Y ORDEN
      ======================================================== */}
      <section className="space-y-6">
        
        {/* Fila superior: Input de búsqueda y selector de orden */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
          
          {/* Campo de búsqueda */}
          <div className="relative w-full sm:max-w-md">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input
              type="text"
              placeholder="Buscar por tema, palabra clave o categoría..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center text-xs"
                title="Limpiar búsqueda"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>

          {/* Selector de Orden */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
            >
              <option value="recent">Más recientes</option>
              <option value="oldest">Más antiguos</option>
              <option value="title">Alfabético (A-Z)</option>
            </select>
          </div>

        </div>

        {/* Fila de pestañas de categorías interactivas */}
        <div className="flex flex-wrap gap-2 items-center justify-center sm:justify-start">
          <button
            type="button"
            onClick={() => setSelectedCategory('todos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'todos'
                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20 scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Todos ({initialArticles.length})
          </button>

          {categories.map((cat) => {
            const count = initialArticles.filter(
              (a) => a.category?.toLowerCase() === cat.toLowerCase()
            ).length;
            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat.toLowerCase())}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20 scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

      </section>

      {/* ========================================================
          3. CUÍCULA DE ARTÍCULOS O ESTADO VACÍO
      ======================================================== */}
      {filteredArticles.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-4 text-2xl">
            <i className="fas fa-search"></i>
          </div>
          <h3 className="text-lg font-black text-gray-900 mb-1">
            No se encontraron artículos
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-6">
            No hay publicaciones que coincidan con los criterios de búsqueda o categoría seleccionada.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('todos');
            }}
            className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-xs font-bold hover:bg-primary-700 transition-all"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredArticles.map((article) => {
            const dateStr = new Date(article.date).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            });

            return (
              <article
                key={article.slug}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Imagen del Artículo con Badge */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                  {/* Badge de Categoría */}
                  <div className="absolute top-3 left-3">
                    <span className="backdrop-blur-md bg-white/90 text-gray-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-xs border border-white/40 uppercase tracking-wide">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Cuerpo del Artículo */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-[11px] text-gray-400 mb-2.5">
                      <span className="flex items-center">
                        <i className="far fa-calendar-alt mr-1.5 text-primary-500"></i>
                        {dateStr}
                      </span>
                      <span className="flex items-center">
                        <i className="far fa-clock mr-1 text-primary-500"></i>
                        {article.readTime || '4 min'}
                      </span>
                    </div>

                    {/* Título */}
                    <h3 className="font-extrabold text-base sm:text-lg text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2 leading-snug">
                      <a href={`/articulo/${article.slug}`}>
                        {article.title}
                      </a>
                    </h3>

                    {/* Resumen */}
                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-3 leading-relaxed mb-4">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Pie de la tarjeta con acciones */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <a
                      href={`/articulo/${article.slug}`}
                      className="inline-flex items-center text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors group/link"
                    >
                      <span>Leer artículo</span>
                      <i className="fas fa-arrow-right ml-1.5 text-[10px] group-hover/link:translate-x-1 transition-transform"></i>
                    </a>

                    {/* Botones de Compartir Rápidos */}
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => handleShareWhatsApp(article)}
                        className="w-7 h-7 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 flex items-center justify-center transition-colors text-xs"
                        title="Compartir en WhatsApp"
                        aria-label="Compartir en WhatsApp"
                      >
                        <i className="fab fa-whatsapp"></i>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleShareFacebook(article)}
                        className="w-7 h-7 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-colors text-xs"
                        title="Compartir en Facebook"
                        aria-label="Compartir en Facebook"
                      >
                        <i className="fab fa-facebook-f"></i>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleShareLink(article)}
                        className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors text-xs"
                        title="Copiar enlace"
                        aria-label="Copiar enlace"
                      >
                        <i className={`fas ${copiedSlug === article.slug ? 'fa-check text-emerald-500' : 'fa-link'}`}></i>
                      </button>
                    </div>
                  </div>

                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ========================================================
          4. BANNER DE CONEXIÓN A TIENDA (SERVICIOS Y PRODUCTOS)
      ======================================================== */}
      <section className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            Servicio Técnico y Catálogo FixStore
          </span>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            ¿Tu equipo o celular necesita diagnóstico profesional?
          </h3>
          <p className="text-xs sm:text-sm text-primary-100 max-w-xl">
            Además de nuestras guías y artículos, ofrecemos mantenimiento preventivo, instalación de programas y cambio de pantallas y baterías garantizado.
          </p>
        </div>

        <a
          href="/productos"
          className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs sm:text-sm shadow-md hover:shadow-xl transition-all active:scale-95 shrink-0"
        >
          <i className="fas fa-th-large mr-2 text-primary-600"></i>
          <span>Explorar Catálogo de Servicios</span>
        </a>
      </section>

    </div>
  );
}

