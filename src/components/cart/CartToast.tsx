/**
 * src/components/cart/CartToast.tsx
 * Notificación flotante (Toast) interactiva que aparece cuando un producto
 * es añadido al carrito de compras.
 * 
 * Permite al usuario continuar navegando sin interrupciones bruscas, ofreciendo
 * un acceso directo a "Ver Carrito" o cerrarlo al instante.
 */

import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { $cartToast, openCart, dismissToast } from '../../stores/cartStore';

export default function CartToast() {
  const toast = useStore($cartToast);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !toast || !toast.visible) {
    return null;
  }

  return (
    <aside
      role="status"
      aria-live="polite"
      aria-label="Confirmación de producto añadido al carrito"
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-[calc(100vw-2rem)] sm:w-auto bg-gray-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl p-3.5 sm:p-4 border border-gray-800 animate-slide-up transition-all"
    >
      <div className="flex items-center gap-3">
        {/* Imagen del producto */}
        {toast.productImage ? (
          <img
            src={toast.productImage}
            alt={toast.productName}
            className="w-12 h-12 rounded-xl object-cover bg-gray-800 border border-gray-700 shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-primary-600/30 text-primary-400 flex items-center justify-center shrink-0 border border-primary-500/30">
            <i className="fas fa-check text-base"></i>
          </div>
        )}

        {/* Información */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              ¡Añadido al Carrito!
            </p>
          </div>
          <p className="text-xs sm:text-sm font-bold text-gray-100 truncate" title={toast.productName}>
            {toast.productName}
          </p>
          <p className="text-[11px] text-gray-400">
            Cantidad: <span className="text-white font-semibold">+{toast.quantity}</span>
          </p>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-1.5 shrink-0 pl-1">
          <button
            type="button"
            onClick={() => {
              dismissToast();
              openCart();
            }}
            className="px-3 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm"
          >
            Ver
          </button>

          <button
            type="button"
            onClick={() => dismissToast()}
            className="w-7 h-7 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors flex items-center justify-center text-xs"
            aria-label="Cerrar notificación"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
    </aside>
  );
}

