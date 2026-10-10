/**
 * src/components/cart/AddToCartButton.tsx
 * Botón modular para agregar productos al carrito con selector de cantidad opcional,
 * feedback interactivo y soporte de Toast.
 * 
 * Optimizaciones:
 * - Soporte para selección y tipeo numérico de cantidad (1 a 99).
 * - Animación de confirmación instantánea ("¡Agregado! ✓").
 * - Integración con el sistema de Toast flotante de la tienda.
 */

import React, { useState } from 'react';
import { addToCart } from '../../stores/cartStore';

interface AddToCartButtonProps {
  product: any;
  showQuantitySelector?: boolean;
  className?: string;
  buttonText?: string;
  iconOnly?: boolean;
  autoOpenCart?: boolean;
  showToast?: boolean;
}

export default function AddToCartButton({
  product,
  showQuantitySelector = false,
  className = '',
  buttonText = 'Agregar al Carrito',
  iconOnly = false,
  autoOpenCart = false,
  showToast = true
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => Math.min(99, prev + 1));
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      setQuantity(Math.max(1, Math.min(99, val)));
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product) return;

    addToCart(product, quantity, autoOpenCart, showToast);

    // Feedback visual animado
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Selector de Cantidad (ideal para la página de detalle de producto) */}
      {showQuantitySelector && (
        <div className="flex items-center border border-gray-200 bg-gray-50 rounded-xl overflow-hidden shrink-0 h-11 shadow-2xs">
          <button
            type="button"
            onClick={handleDecrement}
            className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors active:scale-90"
            aria-label="Disminuir cantidad"
          >
            <i className="fas fa-minus text-xs"></i>
          </button>
          
          <input
            type="number"
            min="1"
            max="99"
            value={quantity}
            onChange={handleQuantityInput}
            className="w-10 text-center font-bold text-sm text-gray-800 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            aria-label="Cantidad seleccionada"
          />

          <button
            type="button"
            onClick={handleIncrement}
            className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors active:scale-90"
            aria-label="Aumentar cantidad"
          >
            <i className="fas fa-plus text-xs"></i>
          </button>
        </div>
      )}

      {/* Botón Principal de Acción */}
      <button
        type="button"
        onClick={handleAddToCart}
        className={`relative inline-flex items-center justify-center transition-all duration-200 active:scale-95 font-bold shadow-xs hover:shadow-md cursor-pointer ${
          isAdded
            ? 'bg-emerald-600 text-white'
            : 'bg-primary-600 hover:bg-primary-700 text-white'
        } ${
          iconOnly
            ? 'w-9 h-9 sm:w-10 sm:h-10 rounded-xl'
            : 'px-4 py-2.5 rounded-xl text-xs sm:text-sm'
        } ${className}`}
        aria-label={isAdded ? 'Producto agregado con éxito' : 'Añadir al carrito de compras'}
        title="Añadir este producto al carrito"
      >
        {isAdded ? (
          <>
            <i className="fas fa-check mr-1.5 text-xs animate-bounce-gentle"></i>
            {!iconOnly && <span>¡Agregado!</span>}
          </>
        ) : (
          <>
            <i className={`fas fa-cart-plus ${!iconOnly ? 'mr-2 text-xs sm:text-sm' : 'text-sm'}`}></i>
            {!iconOnly && <span>{buttonText}</span>}
          </>
        )}
      </button>
    </div>
  );
}
