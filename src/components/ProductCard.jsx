export default function ProductCard({ product }) {
  const handleWhatsAppContact = () => {
    const text = encodeURIComponent('Hola, estoy interesado en ' + product.TITULO);
    window.open('https://wa.me/1234567890?text=' + text, '_blank');
  };

  const handleFacebookShare = () => {
    const url = encodeURIComponent(window.location.origin + '/producto/' + product.id);
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank');
  };

  const handlePhoneCall = () => {
    window.open('tel:+1234567890');
  };

  return (
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
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary-600">
            {product.PRECIO}
          </span>
          <a
            href={`/producto/${product.id}`}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Ver Detalles
          </a>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button 
            onClick={handleWhatsAppContact}
            className="text-green-600 hover:text-green-700 transition-colors"
            title="Contactar por WhatsApp"
          >
            <i className="fab fa-whatsapp text-xl"></i>
          </button>
          <button 
            onClick={handleFacebookShare}
            className="text-blue-600 hover:text-blue-700 transition-colors"
            title="Compartir en Facebook"
          >
            <i className="fab fa-facebook text-xl"></i>
          </button>
          <button 
            onClick={handlePhoneCall}
            className="text-gray-600 hover:text-gray-700 transition-colors"
            title="Llamar"
          >
            <i className="fas fa-phone text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  );
}