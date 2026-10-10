// src/components/islands/CartModal.jsx
import React, { useState } from 'react';
import { SITE_CONFIG } from '../../utils/constants.js';
import { getUTMWGS84 } from '../../utils/geo.js';

export default function CartModal({
  isOpen,
  onClose,
  cartItems = [],
  onRemoveItem,
  onClearCart,
}) {
  const [geoData, setGeoData] = useState(null);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  const FORMSPREE_ID = 'meaqvvbe';

  // ==========================================
  // TOTAL DEL CARRITO
  // ==========================================
  const totalAmount = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.PRECIO) || 0;
    const quantity = Number(item.quantity) || 1;

    return acc + price * quantity;
  }, 0);

  // ==========================================
  // OBTENER GEOLOCALIZACIÓN
  // ==========================================
  const handleFetchLocation = async () => {
    setLoadingGeo(true);
    setGeoError('');

    try {
      const location = await getUTMWGS84();

      if (!location) {
        throw new Error('No se recibió información de ubicación.');
      }

      setGeoData(location);
    } catch (err) {
      console.error('Error de geolocalización:', err);

      setGeoError(
        'No se pudo obtener la ubicación. Verifica los permisos del navegador.'
      );
    } finally {
      setLoadingGeo(false);
    }
  };

  // ==========================================
  // CONSTRUIR RESUMEN DEL PEDIDO
  // ==========================================
  const buildOrderSummaryText = () => {
    let text = `📦 *NUEVO PEDIDO - ${SITE_CONFIG.name}*\n\n`;

    text += `*Productos:*\n`;

    cartItems.forEach((item, index) => {
      const quantity = Number(item.quantity) || 1;
      const price = parseFloat(item.PRECIO) || 0;
      const subtotal = price * quantity;

      text += `${index + 1}. ${item.TITULO || 'Producto'} x${quantity} - $${subtotal.toFixed(2)}\n`;
    });

    text += `\n*Total a Pagar:* $${totalAmount.toFixed(2)}\n\n`;

    if (geoData) {
      text += `📍 *Ubicación de Entrega (UTM WGS84):*\n`;
      text += `${geoData.utmString || 'No disponible'}\n`;

      if (
        geoData.lat !== undefined &&
        geoData.lon !== undefined
      ) {
        text += `Google Maps: https://maps.google.com/?q=${geoData.lat},${geoData.lon}\n`;
      }
    } else {
      text += `📍 *Ubicación:* No adjuntada\n`;
    }

    return text;
  };

  // ==========================================
  // ENVIAR POR WHATSAPP
  // ==========================================
  const handleSendWhatsApp = () => {
    if (cartItems.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    const message = encodeURIComponent(buildOrderSummaryText());

    // Deja únicamente números
    const whatsappNumber = String(SITE_CONFIG.whatsapp || '').replace(
      /\D/g,
      ''
    );

    if (!whatsappNumber) {
      alert('El número de WhatsApp no está configurado.');
      return;
    }

    const url = `https://wa.me/${whatsappNumber}?text=${message}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // ==========================================
  // ENVIAR POR CORREO - FORMSPREE
  // ==========================================
  const handleSendEmail = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    if (!emailInput.trim()) {
      alert('Ingresa un correo electrónico.');
      return;
    }

    setSendingEmail(true);

    try {
      const response = await fetch(
        `https://formspree.io/f/${FORMSPREE_ID}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            email: emailInput.trim(),

            _subject: `Nuevo Pedido de Compra - ${SITE_CONFIG.name}`,

            pedido: buildOrderSummaryText(),

            total: `$${totalAmount.toFixed(2)}`,

            coordenadasUTM: geoData
              ? geoData.utmString
              : 'No proporcionada',

            latitud: geoData?.lat ?? '',
            longitud: geoData?.lon ?? '',
          }),
        }
      );

      if (response.ok) {
        alert('¡Pedido enviado con éxito por correo!');

        setEmailInput('');

        onClearCart?.();
        onClose?.();
      } else {
        const data = await response.json().catch(() => null);

        console.error('Respuesta de Formspree:', data);

        alert('Error al enviar el pedido por correo.');
      }
    } catch (err) {
      console.error('Error al enviar correo:', err);

      alert('Ocurrió un error en el envío.');
    } finally {
      setSendingEmail(false);
    }
  };

  // ==========================================
  // SI EL MODAL ESTÁ CERRADO
  // ==========================================
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-modal-title"
    >
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-gray-950 border border-gray-800 shadow-2xl">

        {/* =====================================
            CABECERA
        ====================================== */}
        <div className="flex items-center justify-between border-b border-gray-800 px-5 py-4">
          <h2
            id="cart-modal-title"
            className="text-lg font-bold text-white"
          >
            🛒 Mi Carrito
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-gray-400 hover:bg-gray-800 hover:text-white"
            aria-label="Cerrar carrito"
          >
            ✕
          </button>
        </div>

        {/* =====================================
            CONTENIDO
        ====================================== */}
        <div className="p-5">

          {/* LISTA DE PRODUCTOS */}
          {cartItems.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">
              Tu carrito está vacío.
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item, idx) => {
                const quantity = Number(item.quantity) || 1;
                const price = parseFloat(item.PRECIO) || 0;

                const imageUrl = Array.isArray(item.IMG)
                  ? item.IMG[0]
                  : item.IMG;

                return (
                  <div
                    key={`${item.TITULO || 'producto'}-${idx}`}
                    className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 p-3"
                  >
                    {/* IMAGEN */}
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.TITULO || 'Producto'}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-800 text-2xl">
                        📦
                      </div>
                    )}

                    {/* INFORMACIÓN */}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-white">
                        {item.TITULO || 'Producto sin nombre'}
                      </h3>

                      <p className="text-xs text-gray-400">
                        ${price.toFixed(2)} × {quantity}
                      </p>

                      <p className="mt-1 text-sm font-bold text-primary-400">
                        ${(price * quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* ELIMINAR */}
                    <button
                      type="button"
                      onClick={() => onRemoveItem?.(idx)}
                      className="rounded-lg p-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      title="Eliminar"
                      aria-label={`Eliminar ${item.TITULO || 'producto'}`}
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* =====================================
              UBICACIÓN UTM
          ====================================== */}
          {cartItems.length > 0 && (
            <div className="mt-5 rounded-xl border border-gray-800 bg-gray-900 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    📍 Ubicación UTM WGS84
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    Adjunta tu ubicación para facilitar la entrega.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleFetchLocation}
                  disabled={loadingGeo}
                  className="rounded-xl bg-primary-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loadingGeo
                    ? 'Obteniendo...'
                    : 'Adjuntar Ubicación'}
                </button>
              </div>

              {/* DATOS UTM */}
              {geoData && (
                <div className="rounded-lg border border-green-900/50 bg-green-950/30 p-3">
                  <p className="break-words text-xs text-green-300">
                    {geoData.utmString}
                  </p>

                  {geoData.lat !== undefined &&
                    geoData.lon !== undefined && (
                      <a
                        href={`https://maps.google.com/?q=${geoData.lat},${geoData.lon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs text-blue-400 hover:text-blue-300"
                      >
                        Ver ubicación en Google Maps →
                      </a>
                    )}
                </div>
              )}

              {/* ERROR */}
              {geoError && (
                <p className="mt-3 rounded-lg bg-red-950/30 p-3 text-xs text-red-400">
                  {geoError}
                </p>
              )}
            </div>
          )}

          {/* =====================================
              TOTAL
          ====================================== */}
          {cartItems.length > 0 && (
            <>
              <div className="my-5 flex items-center justify-between border-t border-gray-800 pt-5">
                <span className="text-base font-semibold text-gray-300">
                  Total:
                </span>

                <span className="text-2xl font-bold text-white">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>

              {/* =====================================
                  WHATSAPP
              ====================================== */}
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-500"
              >
                <span>📱</span>
                Enviar Pedido por WhatsApp
              </button>

              {/* =====================================
                  CORREO
              ====================================== */}
              <form
                onSubmit={handleSendEmail}
                className="rounded-xl border border-gray-800 bg-gray-900 p-4"
              >
                <label
                  htmlFor="emailInput"
                  className="mb-2 block text-xs font-semibold text-gray-300"
                >
                  Enviar pedido por correo
                </label>

                <div className="flex gap-2">
                  <input
                    id="emailInput"
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="tu-correo@ejemplo.com"
                    required
                    disabled={sendingEmail}
                    className="min-w-0 flex-1 rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none disabled:opacity-50"
                  />

                  <button
                    type="submit"
                    disabled={sendingEmail}
                    className="rounded-xl bg-primary-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {sendingEmail ? '⏳' : '📧'}
                  </button>
                </div>
              </form>

              {/* =====================================
                  VACIAR CARRITO
              ====================================== */}
              {onClearCart && (
                <button
                  type="button"
                  onClick={onClearCart}
                  className="mt-4 w-full rounded-xl border border-gray-800 px-4 py-2 text-xs text-gray-400 transition hover:bg-gray-900 hover:text-red-400"
                >
                  Vaciar carrito
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}