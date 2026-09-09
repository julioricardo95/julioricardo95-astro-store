import { useState, useEffect } from 'react';
import productsData from '../../data/products.json';

export default function SearchBox({ initialProducts = productsData }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [products] = useState(initialProducts);

  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = products.filter((product) => {
        const titleMatch = product.TITULO?.toLowerCase().includes(query.toLowerCase());
        const categoryMatch = product.CATEGORIA?.toLowerCase().includes(query.toLowerCase());
        const descriptionMatch = product.DESCRIPCION?.toLowerCase().includes(query.toLowerCase());
        return titleMatch || categoryMatch || descriptionMatch;
      });
      setResults(filtered.slice(0, 5));
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query, products]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/productos?search=${encodeURIComponent(query)}`;
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSearch} className="flex">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            onFocus={() => query && setShowResults(true)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-gray-900 bg-white"
          />
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-500 text-white rounded-r-lg hover:bg-primary-600 transition-colors flex items-center justify-center"
          aria-label="Buscar"
        >
          <i className="fas fa-search"></i>
        </button>
      </form>

      {/* Menú desplegable de resultados */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl mt-1 z-50 overflow-hidden">
          {results.map((product, index) => {
            const productId = product.id || product.ID || index;
            const imageUrl = Array.isArray(product.IMG) && product.IMG.length > 0
              ? product.IMG[0]
              : (typeof product.IMG === 'string' ? product.IMG : '/placeholder.jpg');

            return (
              <a
                key={productId}
                href={`/producto/${productId}`}
                className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={imageUrl}
                    alt={product.TITULO || 'Producto'}
                    className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {product.TITULO}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {product.CATEGORIA} • <span className="font-semibold text-primary-600">{product.PRECIO}</span>
                    </p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}