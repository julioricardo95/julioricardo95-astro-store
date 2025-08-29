import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleSocialClick = (platform: string) => {
    const urls: Record<string, string> = {
      facebook: 'https://facebook.com/techstorepro',
      instagram: 'https://instagram.com/techstorepro',
      twitter: 'https://twitter.com/techstorepro',
      whatsapp: 'https://wa.me/521234567890?text=Hola,%20me%20interesa%20conocer%20más%20sobre%20sus%20productos',
      phone: 'tel:+521234567890'
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank');
    }
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:contacto@techstorepro.com';
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-brand">
              <div className="brand-logo">
                <i className="fas fa-store"></i>
                <span>TechStore Pro</span>
              </div>
              <p className="brand-description">
                Tu tienda de confianza para productos tecnológicos de alta calidad. 
                Innovación, calidad y servicio excepcional.
              </p>
              <div className="social-links">
                <button 
                  onClick={() => handleSocialClick('facebook')}
                  className="social-link facebook"
                  aria-label="Facebook"
                >
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button 
                  onClick={() => handleSocialClick('instagram')}
                  className="social-link instagram"
                  aria-label="Instagram"
                >
                  <i className="fab fa-instagram"></i>
                </button>
                <button 
                  onClick={() => handleSocialClick('twitter')}
                  className="social-link twitter"
                  aria-label="Twitter"
                >
                  <i className="fab fa-twitter"></i>
                </button>
                <button 
                  onClick={() => handleSocialClick('whatsapp')}
                  className="social-link whatsapp"
                  aria-label="WhatsApp"
                >
                  <i className="fab fa-whatsapp"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Productos</h3>
            <ul className="footer-links">
              <li><a href="/productos?category=electronicos">Electrónicos</a></li>
              <li><a href="/productos?category=accesorios">Accesorios</a></li>
              <li><a href="/productos?featured=true">Productos Destacados</a></li>
              <li><a href="/productos?discount=true">Ofertas</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Información</h3>
            <ul className="footer-links">
              <li><a href="/articulos">Blog</a></li>
              <li><a href="/sobre-nosotros">Sobre Nosotros</a></li>
              <li><a href="/politica-privacidad">Política de Privacidad</a></li>
              <li><a href="/terminos-condiciones">Términos y Condiciones</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Contacto</h3>
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>Ciudad de México, México</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <button onClick={() => handleSocialClick('phone')} className="contact-link">
                  +52 123 456 7890
                </button>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <button onClick={handleEmailClick} className="contact-link">
                  contacto@techstorepro.com
                </button>
              </div>
              <div className="contact-item">
                <i className="fas fa-clock"></i>
                <span>Lun - Vie: 9:00 - 18:00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} TechStore Pro. Todos los derechos reservados.
            </p>
            <div className="payment-methods">
              <span className="payment-label">Métodos de pago:</span>
              <div className="payment-icons">
                <i className="fab fa-cc-visa" title="Visa"></i>
                <i className="fab fa-cc-mastercard" title="MasterCard"></i>
                <i className="fab fa-cc-paypal" title="PayPal"></i>
                <i className="fab fa-cc-apple-pay" title="Apple Pay"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: var(--gray-900);
          color: var(--gray-300);
          padding: var(--spacing-20) 0 var(--spacing-8) 0;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: var(--spacing-12);
          margin-bottom: var(--spacing-16);
        }

        .footer-section {
          display: flex;
          flex-direction: column;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: var(--spacing-3);
          font-size: var(--font-size-xl);
          font-weight: 700;
          color: white;
        }

        .brand-logo i {
          font-size: var(--font-size-2xl);
          color: var(--primary-color);
        }

        .brand-description {
          line-height: 1.7;
          margin: 0;
          color: var(--gray-400);
        }

        .social-links {
          display: flex;
          gap: var(--spacing-3);
        }

        .social-link {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-lg);
          color: white;
          transition: all var(--transition-fast);
          text-decoration: none;
        }

        .social-link:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .social-link.facebook {
          background: #1877F2;
        }

        .social-link.instagram {
          background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);
        }

        .social-link.twitter {
          background: #1DA1F2;
        }

        .social-link.whatsapp {
          background: #25D366;
        }

        .footer-title {
          color: white;
          font-size: var(--font-size-lg);
          font-weight: 600;
          margin: 0 0 var(--spacing-6) 0;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-3);
        }

        .footer-links a {
          color: var(--gray-400);
          text-decoration: none;
          transition: color var(--transition-fast);
          font-size: var(--font-size-sm);
        }

        .footer-links a:hover {
          color: var(--primary-light);
          text-decoration: none;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-3);
          font-size: var(--font-size-sm);
        }

        .contact-item i {
          color: var(--primary-color);
          width: 16px;
          text-align: center;
        }

        .contact-link {
          background: none;
          border: none;
          color: var(--gray-400);
          cursor: pointer;
          text-decoration: none;
          transition: color var(--transition-fast);
          padding: 0;
          font-size: inherit;
        }

        .contact-link:hover {
          color: var(--primary-light);
        }

        .footer-bottom {
          border-top: 1px solid var(--gray-700);
          padding-top: var(--spacing-8);
        }

        .footer-bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .copyright {
          margin: 0;
          color: var(--gray-400);
          font-size: var(--font-size-sm);
        }

        .payment-methods {
          display: flex;
          align-items: center;
          gap: var(--spacing-4);
        }

        .payment-label {
          font-size: var(--font-size-sm);
          color: var(--gray-400);
        }

        .payment-icons {
          display: flex;
          gap: var(--spacing-2);
        }

        .payment-icons i {
          font-size: var(--font-size-xl);
          color: var(--gray-500);
          transition: color var(--transition-fast);
        }

        .payment-icons i:hover {
          color: var(--gray-300);
        }

        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: var(--spacing-8);
          }

          .footer-bottom-content {
            flex-direction: column;
            gap: var(--spacing-4);
            text-align: center;
          }

          .payment-methods {
            flex-direction: column;
            gap: var(--spacing-2);
          }

          .social-links {
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;