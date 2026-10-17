/**
 * src/utils/cartFormatters.ts
 * Utilidades modulares y puras para el formateo de moneda, construcción de mensajes de WhatsApp,
 * generación de payloads para Formspree y enlaces de contingencia (mailto).
 */

import type { CartItem, CustomerInfo } from '../types/cart';
import { calculateTotals } from '../stores/cartStore';
import { CURRENCY_CONFIG } from './constants.js';

// Reexportar para facilitar su uso en componentes
export { CURRENCY_CONFIG };

/**
 * Formatea un valor numérico o string al formato monetario configurado en la tienda
 * (ej: "C$30.00" o "$30.00" según ACTIVE_CURRENCY).
 * 
 * @param amount Cantidad a formatear
 * @returns Cadena con formato "C$0.00" o "$0.00"
 */
export function formatCurrency(amount: number | string): string {
  let num: number = 0;
  if (typeof amount === 'number') {
    num = isNaN(amount) ? 0 : amount;
  } else {
    const cleaned = String(amount || 0).replace(/[^0-9.-]/g, '');
    num = parseFloat(cleaned) || 0;
  }
  return `${CURRENCY_CONFIG.symbol}${num.toFixed(2)}`;
}

/**
 * Genera el identificador único para el pedido (ej: FIX-849201).
 */
export function generateOrderId(): string {
  return `FIX-${Date.now().toString().slice(-6)}`;
}

/**
 * Construye el mensaje estructurado con formato enriquecido (Markdown de WhatsApp).
 * Cumple con el requerimiento: "producto cantidad total".
 */
export function buildWhatsAppMessage(
  items: CartItem[],
  customer: CustomerInfo,
  storeName: string = 'FixStore'
): string {
  const { totalItems, total } = calculateTotals(items);
  const orderId = generateOrderId();
  const dateStr = new Date().toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  let message = `🛒 *NUEVO PEDIDO - ${storeName}*\n`;
  message += `📋 *Pedido N°:* #${orderId}\n`;
  message += `📅 *Fecha:* ${dateStr}\n\n`;

  // Datos del Comprador
  const hasCustomerInfo = customer.name || customer.phone || customer.email || customer.address;
  if (hasCustomerInfo) {
    message += `👤 *DATOS DEL CLIENTE:*\n`;
    if (customer.name?.trim()) message += `• *Nombre:* ${customer.name.trim()}\n`;
    if (customer.phone?.trim()) message += `• *WhatsApp / Tel:* ${customer.phone.trim()}\n`;
    if (customer.email?.trim()) message += `• *Correo:* ${customer.email.trim()}\n`;
    if (customer.address?.trim()) message += `• *Dirección / Entrega:* ${customer.address.trim()}\n`;
    if (customer.notes?.trim()) message += `• *Notas:* ${customer.notes.trim()}\n`;
    message += `\n`;
  }

  // Lista de Productos: Producto | Cantidad | Total
  message += `📦 *DETALLE DE PRODUCTOS:*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

  items.forEach((item, index) => {
    const itemPrice = typeof item.PRECIO === 'number' ? item.PRECIO : parseFloat(String(item.PRECIO || 0)) || 0;
    const itemTotal = itemPrice * (item.quantity || 1);

    message += `${index + 1}. *${item.TITULO || 'Producto'}*\n`;
    message += `   ▸ Cantidad: *${item.quantity}*\n`;
    message += `   ▸ Precio Unitario: ${formatCurrency(itemPrice)}\n`;
    message += `   ▸ Total: *${formatCurrency(itemTotal)}*\n\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `📊 *Total de Artículos:* ${totalItems}\n`;
  message += `💰 *TOTAL A PAGAR:* *${formatCurrency(total)}*\n\n`;
  message += `_Mensaje emitido automáticamente desde la tienda web ${storeName}._`;

  return message;
}

/**
 * Genera la URL codificada lista para abrir WhatsApp en navegador o app nativa.
 */
export function getWhatsAppUrl(
  items: CartItem[],
  customer: CustomerInfo,
  whatsappNumber: string,
  storeName: string = 'FixStore'
): string {
  const text = buildWhatsAppMessage(items, customer, storeName);
  const cleanNumber = String(whatsappNumber || '').replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Prepara el cuerpo de datos para la API de Formspree con respuesta de correo directo.
 */
export function buildFormspreePayload(
  items: CartItem[],
  customer: CustomerInfo,
  storeName: string = 'FixStore'
) {
  const { totalItems, total } = calculateTotals(items);
  const orderId = generateOrderId();
  const dateStr = new Date().toLocaleString('es-ES');

  // Construir tabla de productos en texto legible
  let tablaTexto = `LISTA DE PRODUCTOS (Pedido #${orderId})\n`;
  tablaTexto += `=================================================================\n`;
  tablaTexto += `# | PRODUCTO | CANTIDAD | P. UNITARIO | TOTAL\n`;
  tablaTexto += `=================================================================\n`;

  items.forEach((item, index) => {
    const itemPrice = typeof item.PRECIO === 'number' ? item.PRECIO : parseFloat(String(item.PRECIO || 0)) || 0;
    const itemTotal = itemPrice * (item.quantity || 1);
    tablaTexto += `${index + 1}. ${item.TITULO} | Cant: ${item.quantity} | P.U: ${formatCurrency(itemPrice)} | Subtotal: ${formatCurrency(itemTotal)}\n`;
  });

  tablaTexto += `=================================================================\n`;
  tablaTexto += `TOTAL DE ARTÍCULOS: ${totalItems}\n`;
  tablaTexto += `TOTAL A PAGAR: ${formatCurrency(total)}\n`;

  return {
    _subject: `🛍️ Pedido #${orderId} de ${customer.name || 'Cliente'} - ${storeName}`,
    _replyto: customer.email || undefined,
    pedido_id: orderId,
    fecha: dateStr,
    cliente_nombre: customer.name || 'No especificado',
    cliente_telefono: customer.phone || 'No especificado',
    cliente_correo: customer.email || 'No especificado',
    cliente_direccion: customer.address || 'No especificada',
    cliente_notas: customer.notes || 'Ninguna',
    total_articulos: totalItems,
    total_pagar: formatCurrency(total),
    productos_lista: tablaTexto
  };
}

/**
 * Realiza el envío del pedido a Formspree de manera asíncrona mediante fetch.
 */
export async function sendOrderToFormspree(
  endpointUrl: string,
  items: CartItem[],
  customer: CustomerInfo,
  storeName: string = 'FixStore'
): Promise<{ success: boolean; message: string }> {
  try {
    if (!endpointUrl) {
      return {
        success: false,
        message: 'No se ha configurado un endpoint de Formspree.'
      };
    }

    const payload = buildFormspreePayload(items, customer, storeName);

    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      return {
        success: true,
        message: '¡Pedido enviado exitosamente a tu correo electrónico!'
      };
    } else {
      const data = await response.json().catch(() => ({}));
      const errorMsg = data?.errors?.[0]?.message || 'No se pudo procesar el pedido con Formspree.';
      return {
        success: false,
        message: errorMsg
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Error de conexión al enviar el correo.'
    };
  }
}

/**
 * Genera un enlace mailto: como método de respaldo si el servicio de formularios no responde.
 */
export function getMailtoFallbackUrl(
  items: CartItem[],
  customer: CustomerInfo,
  storeEmail: string,
  storeName: string = 'FixStore'
): string {
  const payload = buildFormspreePayload(items, customer, storeName);
  const subject = encodeURIComponent(payload._subject);
  const body = encodeURIComponent(
    `Hola ${storeName},\n\nAdjunto los detalles de mi pedido:\n\n${payload.productos_lista}\n\nDatos de contacto:\nNombre: ${payload.cliente_nombre}\nTeléfono: ${payload.cliente_telefono}\nDirección: ${payload.cliente_direccion}`
  );
  return `mailto:${storeEmail}?subject=${subject}&body=${body}`;
}
