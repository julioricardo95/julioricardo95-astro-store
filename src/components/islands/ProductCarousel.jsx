import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Estilos de Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Importación directa del componente ProductCard reutilizable
import ProductCard from '../ProductCard.jsx';

export default function ProductCarousel({ products: initialProducts = [] }) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialProducts.length > 0) {
      setProducts(initialProducts);
      setLoading(false);
    }
  }, [initialProducts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-primary-600"></div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        No hay productos disponibles para mostrar.
      </div>
    );
  }

  return (
    <div className="relative group/carousel px-1 sm:px-2">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={12}
        slidesPerView={1.2}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          480: { slidesPerView: 1.5, spaceBetween: 16 },
          640: { slidesPerView: 2, spaceBetween: 16 },
          768: { slidesPerView: 2.5, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
          1280: { slidesPerView: 4, spaceBetween: 24 },
        }}
        className="product-carousel !pb-12 !pt-2"
      >
        {products.map((product, index) => {
          const productId = product.id || product.ID || index;
          return (
            /* '!h-auto' permite que todas las tarjetas en la fila tengan la misma altura */
            <SwiperSlide key={productId} className="!h-auto pb-1">
              {/* Llamada al componente reutilizable */}
              <ProductCard product={product} />
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Flechas de navegación personalizadas (Visibles en Laptop / Ocultas en Celular para no obstaculizar la vista) */}
      <button 
        className="swiper-button-prev-custom hidden md:flex absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-11 lg:h-11 bg-white/95 backdrop-blur-md border border-gray-200 text-gray-800 rounded-full items-center justify-center shadow-md hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200 active:scale-90"
        aria-label="Anterior"
      >
        <i className="fas fa-chevron-left text-xs sm:text-sm"></i>
      </button>

      <button 
        className="swiper-button-next-custom hidden md:flex absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-11 lg:h-11 bg-white/95 backdrop-blur-md border border-gray-200 text-gray-800 rounded-full items-center justify-center shadow-md hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200 active:scale-90"
        aria-label="Siguiente"
      >
        <i className="fas fa-chevron-right text-xs sm:text-sm"></i>
      </button>
    </div>
  );
}