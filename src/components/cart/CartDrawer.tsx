/**
 * src/components/cart/CartDrawer.tsx
 * Cajón lateral deslizante (Drawer) para el carrito de compras (FixStore).
 * 
 * Optimizaciones y Mejoras:
 * 1. Precarga silenciosa en segundo plano de jsPDF cuando el cajón se abre.
 * 2. Edición directa de cantidad numérica (input directo + botones +/-).
 * 3. Fallback de correo electrónico (mailto:) si Formspree reporta límite o error.
 * 4. Atributos ARIA de accesibilidad y foco (role="dialog", aria-modal="true").
 * 5. Confirmación inline para vaciar el carrito sin alertas invasivas.
 * 6. Persistencia continua garantizada en localStorage.
 */

import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import {
  $cart,
  $isCartOpen,
  $customerInfo,
  closeCart,
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

export default function CartDrawer() {
  const isOpen = useStore($isCartOpen);
  const cartItems = useStore($cart);
  const customer = useStore($customerInfo);

  // Estados locales para feedback de envío y UI
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  // Totales
  const { totalItems, total } = calculateTotals(cartItems);

  // Precargar librerías de PDF de forma pasiva en cuanto se abre el cajón
  useEffect(() => {
    if (isOpen) {
      preloadPdfLibraries();
    }
  }, [isOpen]);

  // Manejo de la tecla Escape para accesibilidad
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Bloquear el scroll del documento de fondo mientras el cajón está activo
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setConfirmClear(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Enviar pedido por WhatsApp
  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;
    const url = getWhatsAppUrl(cartItems, customer, SITE_CONFIG.whatsapp, SITE_CONFIG.name);
    window.open(url, '_blank');
  };

  // Enviar pedido por Correo vía Formspree
  const handleFormspreeCheckout = async () => {
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

    if (result.success) {
      setTimeout(() => setEmailStatus(null), 5000);
    }
  };

  // Descargar Lista en PDF
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Carrito de compras"
    >
      {/* Fondo oscuro con desenfoque (Backdrop accesible) */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => closeCart()}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-fade-in">
          
          {/* --- CABECERA DEL CAJÓN --- */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shadow-2xs">
                <i className="fas fa-shopping-bag text-base"></i>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                  Carrito de Compras
                </h2>
                <p className="text-xs text-gray-500">
                  {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'} seleccionados
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => closeCart()}
              className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors active:scale-95"
              aria-label="Cerrar carrito de compras"
            >
              <i className="fas fa-times text-base"></i>
            </button>
          </div>

          {/* --- CUERPO DEL CAJÓN (LISTA DE PRODUCTOS) --- */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            
            {/* Si el carrito está vacío */}
            {cartItems.length === 0 ? (
              <div className="text-center py-14 px-4">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gray-50 flex items-center justify-center text-gray-300 mb-4 border border-gray-100">
                  <i className="fas fa-shopping-cart text-3xl"></i>
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-1">
                  Tu carrito está vacío
                </h3>
                <p className="text-xs text-gray-500 mb-6 max-w-xs mx-auto leading-relaxed">
                  Agrega productos de tecnología, servicios o publicidad para armar tu pedido o cotización.
                </p>
                <a
                  href="/productos"
                  onClick={() => closeCart()}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  <i className="fas fa-th-large mr-2"></i>
                  Explorar Catálogo
                </a>
              </div>
            ) : (
              <>
                {/* Lista de Artículos */}
                <div className="space-y-3">
                  {cartItems.map((item) => {
                    const itemImage = item.IMG?.[0] || 'https://via.placeholder.com/150?text=Sin+Imagen';
                    const itemPrice = typeof item.PRECIO === 'number' ? item.PRECIO : parseFloat(String(item.PRECIO || 0)) || 0;
                    const itemSubtotal = itemPrice * (item.quantity || 1);

                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 bg-gray-50/90 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all shadow-2xs"
                      >
                        {/* Miniatura */}
                        <img
                          src={itemImage}
                          alt={item.TITULO}
                          className="w-16 h-16 rounded-xl object-cover bg-white shrink-0 border border-gray-200/70"
                          loading="lazy"
                        />

                        {/* Detalles */}
                        <div className="flex-1 min-w-0">
                          <h4
                            className="font-bold text-xs sm:text-sm text-gray-900 truncate"
                            title={item.TITULO}
                          >
                            {item.TITULO}
                          </h4>
                          <p className="text-[11px] text-gray-400">
                            Unitario: {formatCurrency(itemPrice)}
                          </p>

                          {/* Control de cantidad con input numérico directo */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-gray-200 bg-white rounded-lg overflow-hidden h-7">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 active:scale-90"
                                aria-label="Disminuir cantidad"
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
                                className="w-8 text-center font-bold text-xs text-gray-800 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                aria-label="Cantidad"
                              />

                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 active:scale-90"
                                aria-label="Aumentar cantidad"
                              >
                                <i className="fas fa-plus text-[9px]"></i>
                              </button>
                            </div>

                            {/* Subtotal del item */}
                            <span className="text-xs sm:text-sm font-black text-gray-900">
                              {formatCurrency(itemSubtotal)}
                            </span>
                          </div>
                        </div>

                        {/* Botón Eliminar */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Eliminar de la lista"
                          aria-label="Eliminar"
                        >
                          <i className="fas fa-trash-alt text-xs"></i>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Formulario plegable para datos del comprador */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCustomerForm(!showCustomerForm)}
                    className="w-full flex items-center justify-between py-2 text-xs font-bold text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <span className="flex items-center">
                      <i className="fas fa-user-edit mr-2 text-primary-500"></i>
                      {showCustomerForm ? 'Ocultar datos de entrega' : 'Datos para el pedido / envío'}
                    </span>
                    <i className={`fas fa-chevron-${showCustomerForm ? 'up' : 'down'} text-[10px]`}></i>
                  </button>

                  {showCustomerForm && (
                    <div className="space-y-2.5 mt-2 p-3.5 bg-gray-50 rounded-2xl border border-gray-100 animate-fade-in text-xs">
                      <div>
                        <label className="block text-gray-600 font-semibold mb-1">Nombre Completo</label>
                        <input
                          type="text"
                          placeholder="Tu nombre"
                          value={customer.name}
                          onChange={(e) => updateCustomerInfo({ name: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-gray-600 font-semibold mb-1">WhatsApp / Teléfono</label>
                          <input
                            type="tel"
                            placeholder="+505 ..."
                            value={customer.phone}
                            onChange={(e) => updateCustomerInfo({ phone: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-600 font-semibold mb-1">Correo Electrónico</label>
                          <input
                            type="email"
                            placeholder="correo@ejemplo.com"
                            value={customer.email}
                            onChange={(e) => updateCustomerInfo({ email: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-600 font-semibold mb-1">Dirección / Notas de Entrega</label>
                        <input
                          type="text"
                          placeholder="Ciudad, departamento o referencias"
                          value={customer.address}
                          onChange={(e) => updateCustomerInfo({ address: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Mensaje de estado de envío de correo */}
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
                    {/* Botón de contingencia si Formspree falla */}
                    {emailStatus.type === 'error' && (
                      <a
                        href={getMailtoFallbackUrl(cartItems, customer, SITE_CONFIG.email, SITE_CONFIG.name)}
                        className="inline-flex items-center justify-center px-3 py-1.5 bg-red-600 text-white font-bold rounded-lg text-[11px] hover:bg-red-700 transition-colors"
                      >
                        <i className="fas fa-envelope-open-text mr-1.5"></i>
                        Enviar por app de correo (mailto)
                      </a>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* --- PIE DEL CAJÓN (RESUMEN Y ACCIONES) --- */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/80 space-y-3">
              {/* Desglose de Totales */}
              <div className="space-y-1 text-xs text-gray-600 pb-2 border-b border-gray-200/60">
                <div className="flex justify-between">
                  <span>Total de Artículos:</span>
                  <span className="font-bold text-gray-800">{totalItems}</span>
                </div>
                <div className="flex justify-between items-center text-sm sm:text-base font-black text-gray-900 pt-1">
                  <span>TOTAL A PAGAR:</span>
                  <span className="text-primary-600 text-xl font-black">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Botón 1: Enviar por WhatsApp */}
              <button
                type="button"
                onClick={handleWhatsAppCheckout}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all active:scale-98"
                title="Enviar lista a WhatsApp"
              >
                <i className="fab fa-whatsapp text-lg"></i>
                <span>Enviar pedido por WhatsApp</span>
              </button>

              {/* Fila de Acciones: Correo (Formspree) y PDF */}
              <div className="grid grid-cols-2 gap-2">
                {/* Botón 2: Enviar a Correo vía Formspree */}
                <button
                  type="button"
                  onClick={handleFormspreeCheckout}
                  disabled={isSendingEmail}
                  className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-all active:scale-98"
                  title="Enviar lista de productos a mi correo con Formspree"
                >
                  {isSendingEmail ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-xs"></i>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-envelope text-xs"></i>
                      <span>Enviar a Correo</span>
                    </>
                  )}
                </button>

                {/* Botón 3: Descargar como PDF */}
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPdf}
                  className="bg-gray-800 hover:bg-gray-900 disabled:opacity-50 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-all active:scale-98"
                  title="Descargar lista de productos como archivo .pdf"
                >
                  {isGeneratingPdf ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-xs"></i>
                      <span>Generando...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-file-pdf text-xs text-red-400"></i>
                      <span>Descargar PDF</span>
                    </>
                  )}
                </button>
              </div>

              {/* Botones Secundarios */}
              <div className="flex items-center justify-between pt-1">
                <a
                  href="/carrito"
                  onClick={() => closeCart()}
                  className="text-xs text-primary-600 hover:text-primary-800 font-bold flex items-center"
                >
                  <i className="fas fa-external-link-alt mr-1 text-[10px]"></i>
                  Ver en página completa
                </a>

                {/* Confirmación no invasiva de vaciar carrito */}
                {confirmClear ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-red-600 font-bold">¿Vaciar?</span>
                    <button
                      type="button"
                      onClick={() => {
                        clearCart();
                        setConfirmClear(false);
                      }}
                      className="text-[11px] bg-red-600 text-white px-2 py-0.5 rounded font-bold hover:bg-red-700"
                    >
                      Sí
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClear(false)}
                      className="text-[11px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-bold hover:bg-gray-300"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center"
                  >
                    <i className="fas fa-trash-alt mr-1 text-[10px]"></i>
                    Vaciar carrito
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
