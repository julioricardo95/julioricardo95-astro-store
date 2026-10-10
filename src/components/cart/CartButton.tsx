/**
 * src/components/cart/CartButton.tsx
 * Botón reactivo con contador interactivo (badge) para la barra de navegación de FixStore.
 * 
 * Optimizaciones:
 * - Prevención de desajuste de hidratación (SSR-safe con isMounted).
 * - Animación sutil de pulso al incrementar o decrementar productos.
 * - Etiquetas ARIA dinámicas para accesibilidad de lectores de pantalla.
 */

import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { $cart, toggleCart, calculateTotals } from '../../stores/cartStore';

interface CartButtonProps {
  className?: string;
  showLabel?: boolean;
}

export default function CartButton({ className = '', showLabel = false }: CartButtonProps) {
  const cartItems = useStore($cart);
  const [isMounted, setIsMounted] = useState(false);
  const [animateBadge, setAnimateBadge] = useState(false);

  // Asegurar que el render inicial coincida con SSR antes de leer el estado local
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { totalItems } = calculateTotals(cartItems);

  // Disparar animación de pulso cuando cambia la cantidad
  useEffect(() => {
    if (totalItems > 0) {
      setAnimateBadge(true);
      const timer = setTimeout(() => setAnimateBadge(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  const accessibleLabel = isMounted && totalItems > 0
    ? `Abrir carrito de compras, tienes ${totalItems} ${totalItems === 1 ? 'artículo' : 'artículos'}`
    : 'Abrir carrito de compras';

  return (
    <button
      type="button"
      onClick={() => toggleCart()}
      className={`relative inline-flex items-center justify-center p-2 sm:px-3 sm:py-2 rounded-xl text-gray-700 hover:text-primary-600 bg-gray-100/80 hover:bg-primary-50 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer ${className}`}
      aria-label={accessibleLabel}
      title={accessibleLabel}
    >
      <div className="relative flex items-center justify-center">
        <i className="fas fa-shopping-cart text-lg"></i>
        
        {/* Badge contador reactivo */}
        {isMounted && totalItems > 0 && (
          <span
            className={`absolute -top-2.5 -right-2.5 min-w-[20px] h-5 px-1 bg-primary-600 text-white text-[11px] font-black rounded-full flex items-center justify-center shadow-md border-2 border-white transition-transform ${
              animateBadge ? 'scale-125' : 'scale-100'
            }`}
          >
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </div>

      {showLabel && (
        <span className="ml-2 font-bold text-sm hidden sm:inline-block">
          Carrito
        </span>
      )}
    </button>
  );
}
