import { useState, useEffect } from 'react';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Cargar productos desde el JSON
    fetch('/src/data/products.json')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log('Error loading products:', err));
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = products.filter(product =>
        product.TITULO.toLowerCase().includes(query.toLowerCase()) ||
        product.CATEGORIA.toLowerCase().includes(query.toLowerCase()) ||
        product.DESCRIPCION.toLowerCase().includes(query.toLowerCase())
      );
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
    <div className="relative">
      <form onSubmit={handleSearch} className="flex">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            onFocus={() => query && setShowResults(true)}
            className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-500 text-white rounded-r-lg hover:bg-primary-600 transition-colors"
        >
          <i className="fas fa-search"></i>
        </button>
      </form>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50">
          {results.map((product) => (
            <a
              key={product.id}
              href={`/producto/${product.id}`}
              className="block px-4 py-3 hover:bg-gray-50 border-b last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={product.IMG[0]}
                  alt={product.TITULO}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <p className="font-medium text-gray-900">{product.TITULO}</p>
                  <p className="text-sm text-gray-500">{product.CATEGORIA} - {product.PRECIO}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}