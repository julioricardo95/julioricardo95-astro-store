import { useState, useEffect, useRef, useCallback } from 'react';
import ArticleCard from '../ArticleCard.jsx';
import ProductCard from '../ProductCard.jsx';

export default function InfiniteScroll({ 
  items = [], 
  itemsPerPage = 6, 
  renderItemType = 'ProductCard',
  loadingComponent = null,
  noMoreItemsComponent = null,
  className = ""
}) {
  const [displayedItems, setDisplayedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();
  const loadingRef = useRef();

  // Component mapping
  const componentMap = {
    'ArticleCard': ArticleCard,
    'ProductCard': ProductCard
  };

  const RenderComponent = componentMap[renderItemType] || ProductCard;

  // 🔴 CORRECCIÓN 1: Reiniciar completamente el estado cuando cambia 'items'
  useEffect(() => {
    const initialItems = items.slice(0, itemsPerPage);
    setDisplayedItems(initialItems);
    setCurrentPage(1); // Importante: resetear la página a 1
    setHasMore(items.length > itemsPerPage);
    setLoading(false);
  }, [items, itemsPerPage]);

  // 🔴 CORRECCIÓN 2: Cargar más elementos sin cierres obsoletos (closures)
  const loadMoreItems = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    
    setTimeout(() => {
      // Usamos el valor funcional de prevPage para garantizar que siempre leemos la página real
      setCurrentPage(prevPage => {
        const startIndex = prevPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const newItems = items.slice(startIndex, endIndex);
        
        if (newItems.length > 0) {
          setDisplayedItems(prev => [...prev, ...newItems]);
          setHasMore(endIndex < items.length);
          return prevPage + 1;
        } else {
          setHasMore(false);
          return prevPage;
        }
      });
      
      setLoading(false);
    }, 400);
  }, [items, itemsPerPage, loading, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          loadMoreItems();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    observerRef.current = observer;

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreItems, hasMore, loading]);

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      <span className="ml-3 text-gray-600">Cargando más contenido...</span>
    </div>
  );

  const NoMoreItems = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <i className="fas fa-check text-2xl text-gray-400"></i>
      </div>
      <p className="text-gray-600 font-medium">¡Has visto todo el contenido disponible!</p>
      <p className="text-sm text-gray-500 mt-1">No hay más elementos para mostrar</p>
    </div>
  );

  return (
    <div className={className}>
      {/* Rendered Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {displayedItems.map((item, index) => (
          <div key={item.id || item.ID || index} className="animate-fade-in">
            <RenderComponent 
              {...(renderItemType === 'ProductCard' ? { product: item } : { article: item })}
            />
          </div>
        ))}
      </div>

      {/* Loading Trigger Element */}
      <div ref={loadingRef} className="w-full">
        {loading && (loadingComponent || <LoadingSpinner />)}
      </div>

      {/* No More Items Message */}
      {!hasMore && displayedItems.length > 0 && (
        noMoreItemsComponent || <NoMoreItems />
      )}

      {/* Empty State */}
      {displayedItems.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
            <i className="fas fa-search text-4xl text-gray-400"></i>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No se encontraron elementos</h3>
          <p className="text-gray-600">Intenta con otros términos de búsqueda o filtros.</p>
        </div>
      )}
    </div>
  );
}