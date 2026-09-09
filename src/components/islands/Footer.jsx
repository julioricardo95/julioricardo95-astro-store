import { SITE_CONFIG } from '../../utils/constants.js';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleCall = () => {
    window.open(`tel:${SITE_CONFIG.phone}`);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent('Hola, me gustaría obtener más información')}`, '_blank');
  };

  const handleFacebook = () => {
    window.open(SITE_CONFIG.social.facebook, '_blank');
  };

  const handleInstagram = () => {
    window.open(SITE_CONFIG.social.instagram, '_blank');
  };

  const handleTwitter = () => {
    window.open(SITE_CONFIG.social.twitter, '_blank');
  };

  const handleEmail = () => {
    window.open(`mailto:${SITE_CONFIG.email}`);
  };

  return (
    <footer id="contacto" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <i className="fas fa-store text-white text-lg"></i>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                {SITE_CONFIG.name}
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Tu destino de compras online para productos de calidad premium. 
              Tecnología, moda y accesorios seleccionados especialmente para ti.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <i className="fas fa-map-marker-alt text-primary-400"></i>
                <span className="text-gray-300">
                  {SITE_CONFIG.address.street}, {SITE_CONFIG.address.city}, CP {SITE_CONFIG.address.zip}
                </span>
              </div>
              <button 
                onClick={handleCall}
                className="flex items-center space-x-3 text-sm hover:text-primary-400 transition-colors"
              >
                <i className="fas fa-phone text-primary-400"></i>
                <span>{SITE_CONFIG.phone}</span>
              </button>
              <button 
                onClick={handleEmail}
                className="flex items-center space-x-3 text-sm hover:text-primary-400 transition-colors"
              >
                <i className="fas fa-envelope text-primary-400"></i>
                <span>{SITE_CONFIG.email}</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/productos" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Productos
                </a>
              </li>
              <li>
                <a href="/articulos" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Artículos
                </a>
              </li>
              <li>
                <a href="#contacto" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Categorías</h3>
            <ul className="space-y-3">
              <li>
                <a href="/productos?categoria=Tecnologia" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Tecnología
                </a>
              </li>
              <li>
                <a href="/productos?categoria=Moda" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Moda
                </a>
              </li>
              <li>
                <a href="/productos?categoria=Accesorios" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Accesorios
                </a>
              </li>
              <li>
                <a href="/productos?ofertas=true" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Ofertas Especiales
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Síguenos</h3>
            <p className="text-gray-300 text-sm mb-6">
              Mantente conectado y no te pierdas nuestras ofertas exclusivas.
            </p>
            
            {/* Social Media Buttons */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={handleFacebook}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors transform hover:scale-110"
                title="Facebook"
              >
                <i className="fab fa-facebook text-white"></i>
              </button>
              <button
                onClick={handleInstagram}
                className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full flex items-center justify-center transition-all transform hover:scale-110"
                title="Instagram"
              >
                <i className="fab fa-instagram text-white"></i>
              </button>
              <button
                onClick={handleTwitter}
                className="w-10 h-10 bg-blue-400 hover:bg-blue-500 rounded-full flex items-center justify-center transition-colors transform hover:scale-110"
                title="Twitter"
              >
                <i className="fab fa-twitter text-white"></i>
              </button>
              <button
                onClick={handleWhatsApp}
                className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors transform hover:scale-110"
                title="WhatsApp"
              >
                <i className="fab fa-whatsapp text-white"></i>
              </button>
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Tu email para ofertas exclusivas"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white text-sm"
              />
              <button className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 text-sm">
                <i className="fas fa-paper-plane mr-2"></i>
                Suscribirse
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {currentYear} {SITE_CONFIG.name}. Todos los derechos reservados.
            </div>
            
            <div className="flex space-x-6 text-sm">
              <a href="/privacidad" className="text-gray-400 hover:text-primary-400 transition-colors">
                Política de Privacidad
              </a>
              <a href="/terminos" className="text-gray-400 hover:text-primary-400 transition-colors">
                Términos y Condiciones
              </a>
              <a href="/envios" className="text-gray-400 hover:text-primary-400 transition-colors">
                Información de Envío
              </a>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Aceptamos:</span>
              <div className="flex space-x-2">
                <i className="fab fa-cc-visa text-blue-600 text-xl"></i>
                <i className="fab fa-cc-mastercard text-red-500 text-xl"></i>
                <i className="fab fa-paypal text-blue-500 text-xl"></i>
                <i className="fab fa-apple-pay text-gray-400 text-xl"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}