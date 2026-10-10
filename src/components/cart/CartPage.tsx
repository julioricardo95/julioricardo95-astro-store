/**
 * src/components/cart/CartPage.tsx
 * Vista completa y responsive de la página del carrito de compras (/carrito).
 * 
 * Optimizaciones y Mejoras:
 * 1. Precarga pasiva de PDF al montar el componente.
 * 2. Soporte para edición numérica directa de cantidades (1 a 99).
 * 3. Diseño adaptable con vista de tabla para escritorio y tarjetas compactas para móvil.
 * 4. Fallback de correo electrónico (mailto:) si Formspree tiene problemas.
 * 5. Confirmación no invasiva para vaciar el carrito.
 * 6. Persistencia continua garantizada en localStorage.
 */

import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import {
  $cart,
  $customerInfo,
  updateQuantity,
  removeFromCart,
  clearCart,
  updateCustomerInfo,
  calculateTotals
} from '../../stores/cartStore';
import {
  formatCurrency,
  getWhatsAppUrl,
  sendOrderToFormspree,
  getMailtoFallbackUrl
} from '../../utils/cartFormatters';
import { downloadCartPDF, preloadPdfLibraries } from '../../utils/pdfGenerator';
import { SITE_CONFIG } from '../../utils/constants.js';

export default function CartPage() {
  const cartItems = useStore($cart);
  const customer = useStore($customerInfo);
  const [isMounted, setIsMounted] = useState(false);

  // Estados locales para feedback de UI
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    preloadPdfLibraries();
  }, []);

  const { totalItems, total } = calculateTotals(cartItems);

  // Enviar a WhatsApp
  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;
    const url = getWhatsAppUrl(cartItems, customer, SITE_CONFIG.whatsapp, SITE_CONFIG.name);
    window.open(url, '_blank');
  };

  // Enviar por Correo vía Formspree
  const handleFormspreeCheckout = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSendingEmail(true);
    setEmailStatus(null);

    const endpoint = SITE_CONFIG.formspreeEndpoint || 'https://formspree.io/f/meaqvvbe';
    const result = await sendOrderToFormspree(endpoint, cartItems, customer, SITE_CONFIG.name);

    setIsSendingEmail(false);
    setEmailStatus({
      type: result.success ? 'success' : 'error',
      message: result.message
    });
  };

  // Descargar PDF
  const handleDownloadPDF = async () => {
    if (cartItems.length === 0) return;
    setIsGeneratingPdf(true);
    try {
      await downloadCartPDF(cartItems, customer, {
        name: SITE_CONFIG.name,
        email: SITE_CONFIG.email,
        phone: SITE_CONFIG.phone,
        website: SITE_CONFIG.siteUrl
      });
    } catch (err) {
      console.error('Error generando PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Evitar desajustes de hidratación en SSR
  if (!isMounted) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-primary-600"></div>
      </div>
    );
  }

  // Vista cuando el carrito está vacío
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="w-24 h-24 mx-auto rounded-3xl bg-primary-50 text-primary-500 flex items-center justify-center mb-6 shadow-sm border border-primary-100">
          <i className="fas fa-shopping-cart text-4xl"></i>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 mb-3 tracking-tight">
          Tu carrito de compras está vacío
        </h1>
        <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base mb-8 leading-relaxed">
          Explora nuestra selección de productos y servicios para agregar artículos a tu pedido.
        </p>
        <a
          href="/productos"
          className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 active:scale-95 text-sm sm:text-base"
        >
          <i className="fas fa-th-large mr-2.5"></i>
          Ver Catálogo de Productos
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
      {/* Encabezado Principal */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Carrito de <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Compras</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Revisa la lista de tus productos, ingresa tus datos y genera tu pedido o comprobante en PDF.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- COLUMNA IZQUIERDA: LISTA Y TABLA DE PRODUCTOS --- */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          
          <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-base sm:text-lg flex items-center">
              <i className="fas fa-clipboard-list text-primary-600 mr-2.5"></i>
              Detalle de Productos ({totalItems})
            </h2>

            {/* Confirmación no invasiva para vaciar */}
            {confirmClear ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-600 font-bold">¿Vaciar lista?</span>
                <button
                  type="button"
                  onClick={() => {
                    clearCart();
                    setConfirmClear(false);
                  }}
                  className="text-xs bg-red-600 text-white px-2.5 py-1 rounded-lg font-bold hover:bg-red-700"
                >
                  Sí, vaciar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="text-xs bg-gray-200 text-gray-700 px-2.5 py-1 rounded-lg font-bold hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium flex items-center"
              >
                <i className="fas fa-trash-alt mr-1.5"></i>
                Vaciar carrito
              </button>
            )}
          </div>

          {/* Tabla de Productos para Pantallas Medianas y Grandes */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-6">Producto</th>
                  <th className="py-3 px-4 text-right">P. Unitario</th>
                  <th className="py-3 px-4 text-center">Cantidad</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4 text-center">Quitar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {cartItems.map((item) => {
                  const itemImg = item.IMG?.[0] || 'https://via.placeholder.com/150?text=Sin+Imagen';
                  const itemPrice = typeof item.PRECIO === 'number' ? item.PRECIO : parseFloat(String(item.PRECIO || 0)) || 0;
                  const itemTotal = itemPrice * (item.quantity || 1);

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Producto */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={itemImg}
                            alt={item.TITULO}
                            className="w-14 h-14 rounded-xl object-cover bg-gray-50 border border-gray-200/80 shrink-0"
                            loading="lazy"
                          />
                          <div className="min-w-0">
                            <a
                              href={`/producto/${item.id}`}
                              className="font-bold text-gray-900 hover:text-primary-600 transition-colors line-clamp-1"
                            >
                              {item.TITULO}
                            </a>
                            {item.CATEGORIA && (
                              <span className="text-[10px] uppercase font-semibold text-gray-400 block mt-0.5">
                                {item.CATEGORIA}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Precio Unitario */}
                      <td className="py-4 px-4 text-right font-medium text-gray-600">
                        {formatCurrency(itemPrice)}
                      </td>

                      {/* Selector de Cantidad */}
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex items-center border border-gray-200 bg-white rounded-lg overflow-hidden h-8 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 active:scale-90"
                            aria-label="Disminuir cantidad"
                          >
                            <i className="fas fa-minus text-[10px]"></i>
                          </button>
                          
                          <input
                            type="number"
                            min="1"
                            max="99"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              if (!isNaN(val)) updateQuantity(item.id, val);
                            }}
                            className="w-9 text-center font-bold text-xs text-gray-800 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            aria-label="Cantidad"
                          />

                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 active:scale-90"
                            aria-label="Aumentar cantidad"
                          >
                            <i className="fas fa-plus text-[10px]"></i>
                          </button>
                        </div>
                      </td>

                      {/* Total del Producto */}
                      <td className="py-4 px-4 text-right font-black text-gray-900">
                        {formatCurrency(itemTotal)}
                      </td>

                      {/* Acción Eliminar */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors inline-flex items-center justify-center"
                          title="Eliminar de la lista"
                        >
                          <i className="fas fa-trash-alt text-xs"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Tarjetas Apiladas para Pantallas Pequeñas (Móvil) */}
          <div className="sm:hidden divide-y divide-gray-100 p-3 space-y-3">
            {cartItems.map((item) => {
              const itemImg = item.IMG?.[0] || 'https://via.placeholder.com/150?text=Sin+Imagen';
              const itemPrice = typeof item.PRECIO === 'number' ? item.PRECIO : parseFloat(String(item.PRECIO || 0)) || 0;
              const itemTotal = itemPrice * (item.quantity || 1);

              return (
                <div key={item.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                  <img
                    src={itemImg}
                    alt={item.TITULO}
                    className="w-14 h-14 rounded-xl object-cover bg-gray-50 border border-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-gray-900 truncate">{item.TITULO}</h4>
                    <p className="text-[11px] text-gray-400">P.U: {formatCurrency(itemPrice)}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-200 bg-white rounded-lg overflow-hidden h-7">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100"
                        >
                          <i className="fas fa-minus text-[9px]"></i>
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val)) updateQuantity(item.id, val);
                          }}
                          className="w-7 text-center font-bold text-xs text-gray-800 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100"
                        >
                          <i className="fas fa-plus text-[9px]"></i>
                        </button>
                      </div>

                      <span className="text-xs font-black text-gray-900">{formatCurrency(itemTotal)}</span>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="w-7 h-7 text-gray-400 hover:text-red-500 flex items-center justify-center"
                      >
                        <i className="fas fa-trash-alt text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pie de la Tabla con Subtotal */}
          <div className="p-4 sm:p-6 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between">
            <a
              href="/productos"
              className="text-xs sm:text-sm font-bold text-primary-600 hover:text-primary-800 flex items-center"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Continuar Comprando
            </a>

            <div className="text-right">
              <span className="text-xs text-gray-500 block">Subtotal Calculado</span>
              <span className="text-lg sm:text-2xl font-black text-gray-900">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </div>

        {/* --- COLUMNA DERECHA: DATOS DEL CLIENTE Y ENVÍO --- */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Tarjeta de Datos del Comprador */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <h3 className="font-bold text-gray-900 text-base mb-4 flex items-center">
              <i className="fas fa-user-circle text-primary-600 mr-2.5"></i>
              Datos del Comprador
            </h3>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Nombre Completo</label>
                <input
                  type="text"
                  placeholder="Ej: Julio Gutiérrez"
                  value={customer.name}
                  onChange={(e) => updateCustomerInfo({ name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">WhatsApp / Teléfono</label>
                <input
                  type="tel"
                  placeholder="Ej: +505 5856 7432"
                  value={customer.phone}
                  onChange={(e) => updateCustomerInfo({ phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="Ej: usuario@correo.com"
                  value={customer.email}
                  onChange={(e) => updateCustomerInfo({ email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Dirección / Notas de Entrega</label>
                <textarea
                  rows={2}
                  placeholder="Ciudad, departamento o referencias..."
                  value={customer.address}
                  onChange={(e) => updateCustomerInfo({ address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Tarjeta de Resumen y Acciones */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 space-y-4">
            <h3 className="font-bold text-gray-900 text-base flex items-center">
              <i className="fas fa-file-invoice-dollar text-primary-600 mr-2.5"></i>
              Resumen del Pedido
            </h3>

            <div className="space-y-2 text-xs sm:text-sm text-gray-600 pb-3 border-b border-gray-100">
              <div className="flex justify-between">
                <span>Artículos en orden:</span>
                <span className="font-bold text-gray-900">{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium text-gray-800">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío:</span>
                <span className="text-emerald-600 font-bold">Por coordinar</span>
              </div>
              <div className="flex justify-between items-center pt-2 text-base font-black text-gray-900">
                <span>TOTAL A PAGAR:</span>
                <span className="text-primary-600 text-xl font-black">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Mensaje de estado de Formspree con fallback */}
            {emailStatus && (
              <div
                className={`p-3 rounded-xl text-xs flex flex-col gap-2 ${
                  emailStatus.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <i className={`fas ${emailStatus.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
                  <span className="flex-1 font-semibold">{emailStatus.message}</span>
                </div>
                {emailStatus.type === 'error' && (
                  <a
                    href={getMailtoFallbackUrl(cartItems, customer, SITE_CONFIG.email, SITE_CONFIG.name)}
                    className="inline-flex items-center justify-center px-3 py-1.5 bg-red-600 text-white font-bold rounded-lg text-[11px] hover:bg-red-700 transition-colors"
                  >
                    <i className="fas fa-envelope-open-text mr-1.5"></i>
                    Enviar por aplicación de correo (mailto)
                  </a>
                )}
              </div>
            )}

            {/* BOTONES DE ACCIÓN PRINCIPALES */}
            <div className="space-y-2.5">
              
              {/* Botón WhatsApp */}
              <button
                type="button"
                onClick={handleWhatsAppCheckout}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all active:scale-98"
              >
                <i className="fab fa-whatsapp text-lg"></i>
                <span>Enviar Pedido a WhatsApp</span>
              </button>

              {/* Botón Correo vía Formspree */}
              <button
                type="button"
                onClick={handleFormspreeCheckout}
                disabled={isSendingEmail}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all active:scale-98"
              >
                {isSendingEmail ? (
                  <>
                    <i className="fas fa-spinner fa-spin text-sm"></i>
                    <span>Enviando pedido a tu correo...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-envelope text-sm"></i>
                    <span>Enviar a mi Correo (Formspree)</span>
                  </>
                )}
              </button>

              {/* Botón Descargar PDF */}
              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isGeneratingPdf}
                className="w-full bg-gray-900 hover:bg-black disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all active:scale-98"
              >
                {isGeneratingPdf ? (
                  <>
                    <i className="fas fa-spinner fa-spin text-sm"></i>
                    <span>Generando archivo PDF...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-file-pdf text-red-400 text-sm"></i>
                    <span>Descargar Lista en PDF</span>
                  </>
                )}
              </button>

            </div>

            <p className="text-[11px] text-gray-400 text-center leading-relaxed">
              Tus productos se guardan automáticamente y no se perderán si sales o recargas la página.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
