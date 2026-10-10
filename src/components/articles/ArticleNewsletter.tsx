/**
 * src/components/articles/ArticleNewsletter.tsx
 * Formulario interactivo de suscripción al boletín con conexión real a Formspree.
 */

import React, { useState } from 'react';
import { SITE_CONFIG } from '../../utils/constants.js';

export default function ArticleNewsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('LOADING');
    setErrorMsg('');

    try {
      const endpoint = SITE_CONFIG.formspreeEndpoint || 'https://formspree.io/f/meaqvvbe';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email,
          _subject: `📬 Nueva suscripción al boletín de ${SITE_CONFIG.name} desde /articulos`
        })
      });

      if (response.ok) {
        setStatus('SUCCESS');
        setEmail('');
        setTimeout(() => setStatus('IDLE'), 6000);
      } else {
        setStatus('ERROR');
        setErrorMsg('No se pudo procesar la suscripción. Intenta nuevamente.');
        setTimeout(() => setStatus('IDLE'), 5000);
      }
    } catch {
      setStatus('ERROR');
      setErrorMsg('Error de conexión al enviar tu suscripción.');
      setTimeout(() => setStatus('IDLE'), 5000);
    }
  };

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-r from-gray-900 via-primary-950 to-gray-900 text-white rounded-3xl p-6 sm:p-12 shadow-2xl border border-gray-800 text-center relative overflow-hidden">
      {/* Esferas de Fondo */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-4">
        <span className="inline-block px-3.5 py-1 rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/30 text-xs font-bold uppercase tracking-wider">
          Boletín Tecnológico
        </span>

        <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
          ¿No te quieres perder ninguna guía o novedad?
        </h2>

        <p className="text-xs sm:text-base text-gray-300 leading-relaxed max-w-lg mx-auto">
          Suscríbete y recibe directamente en tu correo consejos prácticos de mantenimiento, alertas de promociones y nuevas guías técnicas.
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="pt-2 max-w-md mx-auto">
          {status === 'SUCCESS' ? (
            <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 animate-fade-in">
              <i className="fas fa-check-circle text-base"></i>
              <span>¡Gracias por suscribirte! Te hemos añadido a nuestro boletín.</span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="email"
                required
                placeholder="Escribe tu correo electrónico..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/15 focus:bg-white border border-white/20 focus:border-primary-500 rounded-xl text-xs sm:text-sm text-white focus:text-gray-900 placeholder-gray-400 focus:outline-none transition-all"
              />

              <button
                type="submit"
                disabled={status === 'LOADING'}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                {status === 'LOADING' ? (
                  <>
                    <i className="fas fa-spinner fa-spin text-xs"></i>
                    <span>Suscribiendo...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane text-xs"></i>
                    <span>Suscribirme</span>
                  </>
                )}
              </button>
            </div>
          )}

          {status === 'ERROR' && (
            <p className="text-red-400 text-xs mt-2 font-medium">{errorMsg}</p>
          )}

          <p className="text-[11px] text-gray-400 mt-3">
            Cero spam. Puedes cancelar tu suscripción en cualquier momento.
          </p>
        </form>
      </div>
    </section>
  );
}

