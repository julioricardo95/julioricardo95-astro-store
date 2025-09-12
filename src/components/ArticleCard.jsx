export default function ArticleCard({ article }) {
  const handleFacebookShare = () => {
    const url = encodeURIComponent(window.location.origin + '/articulo/' + article.slug);
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank');
  };

  const handleWhatsAppShare = () => {
    const url = window.location.origin + '/articulo/' + article.slug;
    const text = encodeURIComponent(article.title + ' - ' + url);
    window.open('https://wa.me/?text=' + text, '_blank');
  };

  return (
    <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300">
      {/* Article Image */}
      <div className="relative overflow-hidden h-48">
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {article.category}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      
      {/* Article Content */}
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <i className="fas fa-calendar-alt mr-2"></i>
          {new Date(article.date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-primary-600 transition-colors">
          <a href={`/articulo/${article.slug}`}>
            {article.title}
          </a>
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {article.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <a 
            href={`/articulo/${article.slug}`}
            className="inline-flex items-center bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Leer Artículo
            <i className="fas fa-arrow-right ml-2"></i>
          </a>
          
          {/* Social Share Buttons */}
          <div className="flex space-x-2">
            <button 
              onClick={handleFacebookShare}
              className="text-blue-600 hover:text-blue-700 transition-colors p-2"
              title="Compartir en Facebook"
            >
              <i className="fab fa-facebook"></i>
            </button>
            <button 
              onClick={handleWhatsAppShare}
              className="text-green-600 hover:text-green-700 transition-colors p-2"
              title="Compartir en WhatsApp"
            >
              <i className="fab fa-whatsapp"></i>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}