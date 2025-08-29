import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Product } from '../types/Product';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ProductCarouselProps {
  products: Product[];
  title?: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, title = "Productos Destacados" }) => {
  const swiperRef = useRef(null);

  const handleProductClick = (productId: string) => {
    window.location.href = `/productos/${productId}`;
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const calculateDiscount = (price: number, originalPrice?: number): number => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <section className="product-carousel-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">Los mejores productos seleccionados para ti</p>
        </div>

        <div className="carousel-container">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            pagination={{
              el: '.swiper-pagination-custom',
              clickable: true,
              renderBullet: (index, className) => {
                return `<span class="${className}"></span>`;
              }
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            loop={true}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              }
            }}
            className="products-swiper"
          >
            {products.map((product) => {
              const discount = calculateDiscount(product.price, product.originalPrice);
              
              return (
                <SwiperSlide key={product.id}>
                  <div 
                    className="product-card"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className="product-image-container">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="product-image"
                        loading="lazy"
                      />
                      {discount > 0 && (
                        <div className="product-badge discount">
                          -{discount}%
                        </div>
                      )}
                      {product.featured && (
                        <div className="product-badge featured">
                          <i className="fas fa-star"></i>
                        </div>
                      )}
                      <div className="product-overlay">
                        <button className="quick-view-btn">
                          <i className="fas fa-eye"></i>
                          Vista rápida
                        </button>
                      </div>
                    </div>
                    
                    <div className="product-info">
                      <div className="product-category">{product.category}</div>
                      <h3 className="product-title">{product.name}</h3>
                      <p className="product-description">{product.shortDescription}</p>
                      
                      <div className="product-price">
                        <span className="current-price">{formatPrice(product.price)}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="original-price">{formatPrice(product.originalPrice)}</span>
                        )}
                      </div>
                      
                      <div className="product-actions">
                        <button 
                          className="btn btn-primary btn-sm whatsapp-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            contactWhatsApp(product.name, formatPrice(product.price), product.shortDescription);
                          }}
                        >
                          <i className="fab fa-whatsapp"></i>
                          Consultar
                        </button>
                        <button 
                          className="btn btn-outline btn-sm facebook-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            shareFacebook(product.name);
                          }}
                        >
                          <i className="fab fa-facebook-f"></i>
                        </button>
                      </div>
                      
                      {product.stock < 10 && product.stock > 0 && (
                        <div className="stock-warning">
                          Solo quedan {product.stock} unidades
                        </div>
                      )}
                      
                      {product.stock === 0 && (
                        <div className="out-of-stock">
                          Agotado
                        </div>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          
          {/* Custom Navigation */}
          <button className="swiper-button-prev-custom carousel-nav-btn">
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="swiper-button-next-custom carousel-nav-btn">
            <i className="fas fa-chevron-right"></i>
          </button>
          
          {/* Custom Pagination */}
          <div className="swiper-pagination-custom"></div>
        </div>
      </div>

      <style jsx>{`
        .product-carousel-section {
          padding: var(--spacing-16) 0;
          background: white;
        }

        .section-header {
          text-align: center;
          margin-bottom: var(--spacing-12);
        }

        .section-title {
          font-size: var(--font-size-3xl);
          font-weight: 700;
          color: var(--gray-900);
          margin-bottom: var(--spacing-3);
        }

        .section-subtitle {
          font-size: var(--font-size-lg);
          color: var(--gray-600);
          margin: 0;
        }

        .carousel-container {
          position: relative;
        }

        .products-swiper {
          padding-bottom: var(--spacing-12);
        }

        .product-card {
          background: white;
          border-radius: var(--border-radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          transition: all var(--transition-normal);
          cursor: pointer;
          height: 100%;
          display: flex;
          flex-direction: column;
          border: 1px solid var(--gray-200);
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
        }

        .product-image-container {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-normal);
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .product-badge {
          position: absolute;
          top: var(--spacing-3);
          right: var(--spacing-3);
          padding: var(--spacing-1) var(--spacing-2);
          border-radius: var(--border-radius-full);
          font-size: var(--font-size-xs);
          font-weight: 600;
          z-index: 2;
        }

        .product-badge.discount {
          background: var(--error-color);
          color: white;
        }

        .product-badge.featured {
          background: var(--accent-color);
          color: white;
          left: var(--spacing-3);
          right: auto;
        }

        .product-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity var(--transition-fast);
        }

        .product-card:hover .product-overlay {
          opacity: 1;
        }

        .quick-view-btn {
          background: white;
          color: var(--gray-900);
          border: none;
          padding: var(--spacing-3) var(--spacing-6);
          border-radius: var(--border-radius-full);
          font-size: var(--font-size-sm);
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
          transition: all var(--transition-fast);
        }

        .quick-view-btn:hover {
          background: var(--primary-color);
          color: white;
          transform: scale(1.05);
        }

        .product-info {
          padding: var(--spacing-5);
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .product-category {
          font-size: var(--font-size-xs);
          color: var(--primary-color);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: var(--spacing-2);
        }

        .product-title {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--gray-900);
          margin: 0 0 var(--spacing-2) 0;
          line-height: 1.3;
        }

        .product-description {
          font-size: var(--font-size-sm);
          color: var(--gray-600);
          margin: 0 0 var(--spacing-4) 0;
          line-height: 1.5;
          flex: 1;
        }

        .product-price {
          display: flex;
          align-items: center;
          gap: var(--spacing-3);
          margin-bottom: var(--spacing-4);
        }

        .current-price {
          font-size: var(--font-size-xl);
          font-weight: 700;
          color: var(--primary-color);
        }

        .original-price {
          font-size: var(--font-size-base);
          color: var(--gray-400);
          text-decoration: line-through;
        }

        .product-actions {
          display: flex;
          gap: var(--spacing-2);
        }

        .add-to-cart {
          flex: 1;
          background: #25D366;
          border-color: #25D366;
        }

        .whatsapp-btn {
          flex: 1;
          background: #25D366;
          border-color: #25D366;
        }

        .whatsapp-btn:hover {
          background: #1ea952;
          border-color: #1ea952;
        }

        .facebook-btn {
          width: 40px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-color: #1877F2;
          color: #1877F2;
        }

        .facebook-btn:hover {
          background: #1877F2;
          color: white;
        }

        .stock-warning {
          font-size: var(--font-size-xs);
          color: var(--accent-color);
          font-weight: 600;
          text-align: center;
          margin-top: var(--spacing-3);
        }

        .out-of-stock {
          font-size: var(--font-size-xs);
          color: var(--error-color);
          font-weight: 600;
          text-align: center;
          background: #FEE2E2;
          padding: var(--spacing-2);
          border-radius: var(--border-radius);
          margin-top: var(--spacing-3);
        }

        .carousel-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: white;
          border: 2px solid var(--gray-200);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
          z-index: 10;
          color: var(--gray-600);
          font-size: var(--font-size-lg);
        }

        .carousel-nav-btn:hover {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
          transform: translateY(-50%) scale(1.1);
        }

        .swiper-button-prev-custom {
          left: -25px;
        }

        .swiper-button-next-custom {
          right: -25px;
        }

        .swiper-pagination-custom {
          text-align: center;
          margin-top: var(--spacing-6);
        }

        .swiper-pagination-custom :global(.swiper-pagination-bullet) {
          width: 12px;
          height: 12px;
          background: var(--gray-300);
          border-radius: 50%;
          display: inline-block;
          margin: 0 var(--spacing-1);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .swiper-pagination-custom :global(.swiper-pagination-bullet-active) {
          background: var(--primary-color);
          transform: scale(1.3);
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: var(--font-size-2xl);
          }

          .carousel-nav-btn {
            display: none;
          }

          .product-image-container {
            height: 180px;
          }

          .product-info {
            padding: var(--spacing-4);
          }

          .product-title {
            font-size: var(--font-size-base);
          }

          .current-price {
            font-size: var(--font-size-lg);
          }
        }
      `}</style>
    </section>
  );
};

// Funciones globales para WhatsApp y Facebook
const contactWhatsApp = (productName: string, price: string, description: string) => {
  const message = `¡Hola! Me interesa este producto:

📱 *${productName}*
💰 Precio: ${price}
📝 ${description}

¿Podrían darme más información y disponibilidad?`;
  
  const phoneNumber = '521234567890'; // Reemplaza con tu número real
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
};

const shareFacebook = (productName: string) => {
  const url = window.location.href;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent('¡Mira este increíble producto: ' + productName + '!')}`;
  window.open(facebookUrl, '_blank', 'width=600,height=400');
};

export default ProductCarousel;