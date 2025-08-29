import React, { useState, useEffect } from 'react';
import type { Product } from '../types/Product';

interface SearchFilterProps {
  onFilter?: (filteredProducts: Product[]) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Cargar productos
    const loadProducts = async () => {
      try {
        const response = await fetch('/src/data/products.json');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    // Filtrar productos
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.categorySlug === selectedCategory);
    }

    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(product => {
        if (max) {
          return product.price >= min && product.price <= max;
        }
        return product.price >= min;
      });
    }

    setFilteredProducts(filtered);
    setShowResults(searchTerm.length > 2);
    
    if (onFilter) {
      onFilter(filtered);
    }
  }, [searchTerm, selectedCategory, priceRange, products, onFilter]);

  const categories = [
    { value: '', label: 'Todas las categorías' },
    { value: 'electronicos', label: 'Electrónicos' },
    { value: 'accesorios', label: 'Accesorios' }
  ];

  const priceRanges = [
    { value: '', label: 'Todos los precios' },
    { value: '0-200', label: 'Hasta $200' },
    { value: '200-500', label: '$200 - $500' },
    { value: '500-1000', label: '$500 - $1000' },
    { value: '1000', label: 'Más de $1000' }
  ];

  const handleProductClick = (productId: string) => {
    window.location.href = `/productos/${productId}`;
    setShowResults(false);
  };

  return (
    <div className="search-filter">
      <div className="search-form">
        <div className="search-input-group">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filters">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="filter-select"
          >
            {priceRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showResults && (
        <div className="search-results">
          <div className="results-header">
            <h4>Resultados de búsqueda ({filteredProducts.length})</h4>
            <button 
              onClick={() => setShowResults(false)}
              className="close-results"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="results-list">
            {filteredProducts.slice(0, 5).map(product => (
              <div
                key={product.id}
                className="result-item"
                onClick={() => handleProductClick(product.id)}
              >
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="result-image"
                  loading="lazy"
                />
                <div className="result-info">
                  <h5 className="result-title">{product.name}</h5>
                  <p className="result-category">{product.category}</p>
                  <div className="result-price">
                    <span className="current-price">${product.price}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="original-price">${product.originalPrice}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredProducts.length > 5 && (
              <div className="view-all">
                <a href={`/productos?search=${encodeURIComponent(searchTerm)}&category=${selectedCategory}&price=${priceRange}`}>
                  Ver todos los resultados ({filteredProducts.length})
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .search-filter {
          position: relative;
          width: 100%;
          max-width: 600px;
        }
        
        .search-form {
          display: flex;
          gap: var(--spacing-3);
          align-items: center;
          background: white;
          padding: var(--spacing-2);
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--gray-200);
        }
        
        .search-input-group {
          position: relative;
          flex: 1;
          min-width: 200px;
        }
        
        .search-icon {
          position: absolute;
          left: var(--spacing-4);
          top: 50%;
          transform: translateY(-50%);
          color: var(--gray-400);
          font-size: var(--font-size-base);
          z-index: 2;
        }
        
        .search-input {
          width: 100%;
          padding: var(--spacing-4) var(--spacing-4) var(--spacing-4) var(--spacing-12);
          border: 1px solid var(--gray-300);
          border-radius: var(--border-radius-lg);
          font-size: var(--font-size-base);
          transition: border-color var(--transition-fast);
          background: var(--gray-50);
          min-height: 48px;
        }
        
        .search-input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          background: white;
        }
        
        .search-input::placeholder {
          color: var(--gray-500);
          font-size: var(--font-size-sm);
        }
        
        .filters {
          display: flex;
          gap: var(--spacing-3);
        }
        
        .filter-select {
          padding: var(--spacing-4);
          border: 1px solid var(--gray-300);
          border-radius: var(--border-radius);
          font-size: var(--font-size-base);
          background: white;
          cursor: pointer;
          transition: border-color var(--transition-fast);
          min-height: 48px;
          min-width: 120px;
        }
        
        .filter-select:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        .search-results {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid var(--gray-300);
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-xl);
          z-index: 1000;
          max-height: 400px;
          overflow-y: auto;
          margin-top: var(--spacing-3);
        }
        
        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-5);
          border-bottom: 1px solid var(--gray-200);
          background: var(--primary-color);
          border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
        }
        
        .results-header h4 {
          margin: 0;
          font-size: var(--font-size-base);
          color: white;
          font-weight: 600;
        }
        
        .close-results {
          background: none;
          border: none;
          cursor: pointer;
          color: white;
          font-size: var(--font-size-lg);
          padding: var(--spacing-2);
          border-radius: var(--border-radius);
          transition: all var(--transition-fast);
        }
        
        .close-results:hover {
          color: var(--gray-200);
          background: rgba(255, 255, 255, 0.1);
        }
        
        .results-list {
          padding: var(--spacing-4);
        }
        
        .result-item {
          display: flex;
          align-items: center;
          padding: var(--spacing-4);
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: background-color var(--transition-fast);
          gap: var(--spacing-4);
          border-bottom: 1px solid var(--gray-100);
        }
        
        .result-item:last-child {
          border-bottom: none;
        }
        
        .result-item:hover {
          background: var(--primary-color);
          color: white;
        }
        
        .result-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: var(--border-radius);
          border: 1px solid var(--gray-200);
          flex-shrink: 0;
        }
        
        .result-info {
          flex: 1;
        }
        
        .result-title {
          margin: 0 0 var(--spacing-1) 0;
          font-size: var(--font-size-base);
          font-weight: 500;
          color: var(--gray-900);
          line-height: 1.3;
        }
        
        .result-item:hover .result-title {
          color: white;
        }
        
        .result-category {
          margin: 0 0 var(--spacing-1) 0;
          font-size: var(--font-size-xs);
          color: var(--gray-500);
        }
        
        .result-item:hover .result-category {
          color: rgba(255, 255, 255, 0.8);
        }
        
        .result-price {
          display: flex;
          align-items: center;
          gap: var(--spacing-3);
        }
        
        .current-price {
          font-weight: 600;
          color: var(--primary-color);
          font-size: var(--font-size-base);
        }
        
        .result-item:hover .current-price {
          color: white;
        }
        
        .original-price {
          text-decoration: line-through;
          color: var(--gray-400);
          font-size: var(--font-size-xs);
        }
        
        .result-item:hover .original-price {
          color: rgba(255, 255, 255, 0.7);
        }
        
        .view-all {
          padding: var(--spacing-4);
          border-top: 1px solid var(--gray-200);
          text-align: center;
          background: var(--gray-50);
        }
        
        .view-all a {
          color: var(--primary-color);
          text-decoration: none;
          font-size: var(--font-size-base);
          font-weight: 500;
          padding: var(--spacing-2) var(--spacing-4);
          border-radius: var(--border-radius);
          transition: all var(--transition-fast);
          display: inline-block;
        }
        
        .view-all a:hover {
          background: var(--primary-color);
          color: white;
          text-decoration: none;
          transform: translateY(-1px);
        }
        
        @media (max-width: 768px) {
          .search-filter {
            max-width: 100%;
          }
        
          .search-form {
            flex-direction: column;
            gap: var(--spacing-4);
            padding: var(--spacing-4);
          }
        
          .filters {
            width: 100%;
            flex-direction: column;
            gap: var(--spacing-3);
          }
        
          .filter-select {
            width: 100%;
          }
        
          .search-results {
            left: 0;
            right: 0;
            margin-top: var(--spacing-2);
          }
        
          .result-item {
            padding: var(--spacing-3);
            gap: var(--spacing-3);
          }
        
          .result-image {
            width: 50px;
            height: 50px;
          }
        
          .result-title {
            font-size: var(--font-size-sm);
          }
        }
      `}</style>
    </div>
  );
};

export default SearchFilter;