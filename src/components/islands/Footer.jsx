import React, { useState } from 'react';
import { SITE_CONFIG } from '../../utils/constants.js';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Estados para el formulario de Formspree
  const [emailInput, setEmailInput] = useState('');
  const [status, setStatus] = useState('IDLE'); // 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'

  // Número de teléfono limpio para llamadas
  const cleanPhone = SITE_CONFIG.phone.replace(/\s+/g, '');

  // ID de Formspree
  const FORMSPREE_ID = 'meaqvvbe'; 

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setStatus('LOADING');

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: emailInput,
          _subject: `¡Nueva suscripción al boletín de ${SITE_CONFIG.name}!`,
        }),
      });

      if (response.ok) {
        setStatus('SUCCESS');
        setEmailInput('');
        setTimeout(() => setStatus('IDLE'), 5000);
      } else {
        setStatus('ERROR');
        setTimeout(() => setStatus('IDLE'), 5000);
      }
    } catch (error) {
      console.error('Error al enviar a Formspree:', error);
      setStatus('ERROR');
      setTimeout(() => setStatus('IDLE'), 5000);
    }
  };

  return (
    <footer id="contacto" className="bg-gray-950 text-gray-300 border-t border-gray-800/80 relative overflow-hidden font-sans">
      
      {/* LÍNEA GRADIENTE SUPERIOR BRILLANTE */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-80" />

      {/* EFECTOS AMBIENTALES DE LUZ NEÓN (GLOW ORBS) */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-primary-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-secondary-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-28 lg:pb-14 relative z-10">
        
        {/* GRID PRINCIPAL DE CONTENIDO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-14 sm:mb-20">
          
          {/* 1. INFORMACIÓN DE LA EMPRESA (COL 4) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Logo e Identidad con Efecto Glow */}
            <a href="/" className="inline-flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition duration-300 group-hover:scale-105" />
                <div className="relative w-11 h-11 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center text-white">
                  <i className="fas fa-store text-lg text-primary-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>

              <span className="text-2xl font-black tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-400 group-hover:to-secondary-400 transition-all">
                {SITE_CONFIG.name}
              </span>
            </a>

            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Tu destino definitivo de compras online. Selección exclusiva de tecnología, moda y estilo con la máxima garantía de satisfacción.
            </p>

            {/* Fichas Interactivas de Contacto */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center space-x-3 text-xs sm:text-sm text-gray-400 p-2 rounded-xl hover:bg-gray-900/60 transition-colors border border-transparent hover:border-gray-800/80 group">
                <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0 group-hover:bg-primary-500/20 transition-colors">
                  <i className="fas fa-map-marker-alt text-primary-400 text-xs" />
                </div>
                <span className="truncate">
                  {SITE_CONFIG.address.street}, {SITE_CONFIG.address.city}, CP {SITE_CONFIG.address.zip}
                </span>
              </div>

              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center space-x-3 text-xs sm:text-sm text-gray-400 hover:text-primary-400 p-2 rounded-xl hover:bg-gray-900/60 transition-all border border-transparent hover:border-gray-800/80 group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0 group-hover:bg-primary-500/20 transition-colors">
                  <i className="fas fa-phone text-primary-400 text-xs" />
                </div>
                <span className="font-medium">{SITE_CONFIG.phone}</span>
              </a>

              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="flex items-center space-x-3 text-xs sm:text-sm text-gray-400 hover:text-primary-400 p-2 rounded-xl hover:bg-gray-900/60 transition-all border border-transparent hover:border-gray-800/80 group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0 group-hover:bg-primary-500/20 transition-colors">
                  <i className="fas fa-envelope text-primary-400 text-xs" />
                </div>
                <span className="truncate font-medium">{SITE_CONFIG.email}</span>
              </a>
            </div>
          </div>

          {/* 2. ENLACES RÁPIDOS (COL 2) */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-xs sm:text-sm tracking-widest uppercase mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-ping" />
              Navegación
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              {[
                { name: 'Inicio', url: '/' },
                { name: 'Catálogo', url: '/productos' },
                { name: 'Novedades', url: '/articulos' },
                { name: 'Contacto', url: '#contacto' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    className="text-gray-400 hover:text-white transition-all duration-200 flex items-center group/link hover:translate-x-1"
                  >
                    <i className="fas fa-chevron-right text-[9px] text-primary-500 opacity-0 group-hover/link:opacity-100 -ml-2 group-hover/link:ml-0 transition-all mr-2" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. CATEGORÍAS (COL 2) */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-xs sm:text-sm tracking-widest uppercase mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
              Categorías
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              {[
                { name: 'Tecnología', url: '/productos?categoria=Tecnologia' },
                { name: 'Moda y Estilo', url: '/productos?categoria=Moda' },
                { name: 'Accesorios', url: '/productos?categoria=Accesorios' },
                { name: 'Ofertas 🔥', url: '/productos?ofertas=true' },
              ].map((cat) => (
                <li key={cat.name}>
                  <a
                    href={cat.url}
                    className="text-gray-400 hover:text-white transition-all duration-200 flex items-center group/link hover:translate-x-1"
                  >
                    <i className="fas fa-chevron-right text-[9px] text-secondary-500 opacity-0 group-hover/link:opacity-100 -ml-2 group-hover/link:ml-0 transition-all mr-2" />
                    <span>{cat.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. TARJETA DE BOLETÍN Y REDES (COL 4) */}
          <div className="lg:col-span-4">
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-gray-900/90 to-gray-950/90 border border-gray-800/80 shadow-2xl backdrop-blur-xl relative overflow-hidden group/card hover:border-gray-700/80 transition-all">
              
              {/* Resplandor superior en la tarjeta */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl pointer-events-none group-hover/card:bg-primary-500/20 transition-all" />

              <h3 className="text-white font-bold text-sm sm:text-base mb-1.5 flex items-center gap-2">
                <i className="fas fa-paper-plane text-primary-400 text-xs" />
                <span>Únete a nuestro Boletín</span>
              </h3>
              
              <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                Recibe promociones VIP y cupones de descuento exclusivos.
              </p>

              {/* FORMULARIO DE SUSCRIPCIÓN CON EFECTO SHIMMER */}
              <form onSubmit={handleNewsletterSubmit} className="space-y-3 mb-6">
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="tuemail@ejemplo.com"
                    required
                    disabled={status === 'LOADING'}
                    className="w-full px-4 py-3 bg-gray-950/90 border border-gray-800 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-white placeholder-gray-500 text-xs transition-all shadow-inner disabled:opacity-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'LOADING'}
                  className="relative overflow-hidden w-full bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 active:scale-98 text-white px-4 py-3 rounded-xl font-extrabold text-xs transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center space-x-2 disabled:opacity-50 group/btn"
                >
                  {/* Destello animado (Shimmer effect) */}
                  <span className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover/btn:animate-shimmer pointer-events-none" />

                  {status === 'LOADING' ? (
                    <>
                      <i className="fas fa-circle-notch animate-spin text-xs" />
                      <span>Enviando...</span>
                    </>
                  ) : status === 'SUCCESS' ? (
                    <>
                      <i className="fas fa-check-circle text-xs text-emerald-300" />
                      <span>¡Suscripción Confirmada!</span>
                    </>
                  ) : status === 'ERROR' ? (
                    <>
                      <i className="fas fa-exclamation-triangle text-xs text-amber-300" />
                      <span>Error al enviar. Reintentar</span>
                    </>
                  ) : (
                    <>
                      <span>Suscribirme Ahora</span>
                      <i className="fas fa-arrow-right text-xs group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* REDES SOCIALES CON GLOW INDIVIDUAL */}
              <div>
                <span className="text-[10px] font-bold text-gray-400 block mb-3 uppercase tracking-wider">
                  Síguenos en redes:
                </span>
                
                <div className="grid grid-cols-4 gap-2">
                  {[
                    {
                      name: 'Facebook',
                      icon: 'fab fa-facebook-f',
                      url: SITE_CONFIG.social.facebook,
                      glow: 'hover:border-blue-500 hover:text-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]',
                    },
                    {
                      name: 'Instagram',
                      icon: 'fab fa-instagram',
                      url: SITE_CONFIG.social.instagram,
                      glow: 'hover:border-pink-500 hover:text-pink-400 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)]',
                    },
                    {
                      name: 'Twitter',
                      icon: 'fab fa-twitter',
                      url: SITE_CONFIG.social.twitter,
                      glow: 'hover:border-sky-400 hover:text-sky-400 hover:shadow-[0_0_15px_rgba(56,189,248,0.3)]',
                    },
                    {
                      name: 'WhatsApp',
                      icon: 'fab fa-whatsapp',
                      url: `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent('Hola, me gustaría obtener más información')}`,
                      glow: 'hover:border-emerald-500 hover:text-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]',
                    },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={social.name}
                      aria-label={social.name}
                      className={`h-10 rounded-xl bg-gray-950 border border-gray-800 text-gray-400 flex items-center justify-center transition-all duration-300 active:scale-90 hover:-translate-y-0.5 ${social.glow}`}
                    >
                      <i className={`${social.icon} text-sm`} />
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* PIE DE PÁGINA INFERIOR CON DIVISOR CRISTAL */}
        <div className="border-t border-gray-800/80 pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5 text-center lg:text-left">
            
            <p className="text-xs text-gray-500">
              © {currentYear} <span className="text-gray-300 font-bold">{SITE_CONFIG.name}</span>. Todos los derechos reservados.
            </p>

            {/* Políticas */}
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
              <a href="/privacidad" className="hover:text-primary-400 transition-colors">
                Política de Privacidad
              </a>
              <span className="text-gray-800 hidden sm:inline">•</span>
              <a href="/terminos" className="hover:text-primary-400 transition-colors">
                Términos y Condiciones
              </a>
              <span className="text-gray-800 hidden sm:inline">•</span>
              <a href="/envios" className="hover:text-primary-400 transition-colors">
                Envíos y Devoluciones
              </a>
            </div>

            {/* Métodos de Pago con Efecto Hover Glow */}
            <div className="flex items-center space-x-3 pt-1 lg:pt-0">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Pagos 100% Seguros
              </span>
              <div className="flex items-center space-x-2.5 text-gray-400">
                <i className="fab fa-cc-visa text-xl hover:text-white hover:scale-110 transition-all cursor-pointer" title="Visa" />
                <i className="fab fa-cc-mastercard text-xl hover:text-white hover:scale-110 transition-all cursor-pointer" title="Mastercard" />
                <i className="fab fa-paypal text-xl hover:text-white hover:scale-110 transition-all cursor-pointer" title="PayPal" />
                <i className="fab fa-apple-pay text-xl hover:text-white hover:scale-110 transition-all cursor-pointer" title="Apple Pay" />
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ESTILOS Y KEYFRAMES DE ANIMACIONES */}
      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(200%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.08); }
        }
        .animate-pulse-slow {
          animation: pulseSlow 6s ease-in-out infinite;
        }
      `}</style>

    </footer>
  );
}