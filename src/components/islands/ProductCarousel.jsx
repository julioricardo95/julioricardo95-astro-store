import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ProductCarousel({ products: initialProducts = [] }) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Si no se pasaron productos por props, sincroniza si cambian
    if (initialProducts.length > 0) {
      setProducts(initialProducts);
      setLoading(false);
    }
  }, [initialProducts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No hay productos disponibles para mostrar.
      </div>
    );
  }

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
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
        }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="product-carousel pb-12"
      >
        {products.map((product, index) => {
          const productId = product.id || product.ID || index;
          const imageUrl = Array.isArray(product.IMG) && product.IMG.length > 0 
            ? product.IMG[0] 
            : (typeof product.IMG === 'string' ? product.IMG : '/placeholder.jpg');

          return (
            <SwiperSlide key={productId}>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={product.TITULO || 'Producto'}
                    className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  {product.CATEGORIA && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-semibold capitalize">
                        {product.CATEGORIA}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {product.TITULO}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.DESCRIPCION}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary-600">
                      {product.PRECIO}
                    </span>
                    <a
                      href={`/producto/${productId}`}
                      className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors transform hover:scale-105"
                    >
                      Ver Detalles
                    </a>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <button 
                      onClick={() => window.open(`https://wa.me/1234567890?text=Hola, estoy interesado en ${encodeURIComponent(product.TITULO)}`, '_blank')}
                      className="text-green-600 hover:text-green-700 transition-colors"
                      title="Contactar por WhatsApp"
                    >
                      <i className="fab fa-whatsapp text-xl"></i>
                    </button>
                    <button 
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/producto/' + productId)}`, '_blank')}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                      title="Compartir en Facebook"
                    >
                      <i className="fab fa-facebook text-xl"></i>
                    </button>
                    <button 
                      onClick={() => window.open(`tel:+1234567890`)}
                      className="text-gray-600 hover:text-gray-700 transition-colors"
                      title="Llamar"
                    >
                      <i className="fas fa-phone text-xl"></i>
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button className="swiper-button-prev-custom absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl z-10 transition-all">
        <i className="fas fa-chevron-left text-primary-500"></i>
      </button>
      <button className="swiper-button-next-custom absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl z-10 transition-all">
        <i className="fas fa-chevron-right text-primary-500"></i>
      </button>
    </div>
  );
}