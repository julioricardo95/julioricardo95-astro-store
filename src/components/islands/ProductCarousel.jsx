import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ProductCarousel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de productos
    const loadProducts = async () => {
      try {
        // En un proyecto real, esto vendría de una API
        const mockProducts = [
          {
            id: "smartphone-pro-max",
            TITULO: "Smartphone Pro Max 256GB",
            CATEGORIA: "Tecnología",
            IMG: ["https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg"],
            DESCRIPCION: "El último smartphone con tecnología avanzada",
            PRECIO: "$999"
          },
          {
            id: "laptop-gaming-ultra",
            TITULO: "Laptop Gaming Ultra RTX 4080",
            CATEGORIA: "Tecnología", 
            IMG: ["https://images.pexels.com/photos/18105/pexels-photo.jpg"],
            DESCRIPCION: "Laptop gaming de alto rendimiento",
            PRECIO: "$2499"
          },
          {
            id: "auriculares-wireless-premium",
            TITULO: "Auriculares Wireless Premium",
            CATEGORIA: "Tecnología",
            IMG: ["https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg"],
            DESCRIPCION: "Auriculares inalámbricos con cancelación de ruido",
            PRECIO: "$299"
          },
          {
            id: "vestido-elegante-noche",
            TITULO: "Vestido Elegante de Noche",
            CATEGORIA: "Moda",
            IMG: ["https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg"],
            DESCRIPCION: "Vestido de noche elegante, confeccionado en seda premium",
            PRECIO: "$399"
          }
        ];
        
        setProducts(mockProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error loading products:', error);
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
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
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1280: {
            slidesPerView: 4,
          },
        }}
        className="product-carousel"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="relative overflow-hidden">
                <img
                  src={product.IMG[0]}
                  alt={product.TITULO}
                  className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {product.CATEGORIA}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                  {product.TITULO}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.DESCRIPCION}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary-600">
                    {product.PRECIO}
                  </span>
                  <a
                    href={`/producto/${product.id}`}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors transform hover:scale-105"
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
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/producto/' + product.id)}`, '_blank')}
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
        ))}
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