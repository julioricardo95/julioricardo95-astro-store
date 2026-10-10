/**
 * src/utils/pdfGenerator.ts
 * Generador optimizado y modular de documentos PDF para la lista de productos de FixStore.
 * 
 * Optimizaciones:
 * - Precarga proactiva (preloadPdfLibraries) para generación instantánea sin latencia.
 * - Soporte para jsPDF y jsPDF-AutoTable con verificación robusta de constructores globales.
 * - Estilos tipográficos profesionales con alineación numérica precisa y totales destacados.
 * - Contingencia (fallback) segura contra bloqueadores de popups usando iframe oculto o descarga directa.
 */

import type { CartItem, CustomerInfo } from '../types/cart';
import { calculateTotals } from '../stores/cartStore';
import { formatCurrency, generateOrderId } from './cartFormatters';

const JSPDF_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
const AUTOTABLE_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js';

let isPreloading = false;
let isLoaded = false;

/**
 * Carga un script dinámico si no existe previamente en el DOM
 */
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Fallo al cargar script: ${src}`));
    document.head.appendChild(script);
  });
}

/**
 * Precarga de forma pasiva las librerías jsPDF para que estén listas en memoria
 * cuando el usuario haga clic en "Descargar PDF".
 */
export async function preloadPdfLibraries(): Promise<boolean> {
  if (isLoaded) return true;
  if (isPreloading) return false;
  if (typeof window === 'undefined') return false;

  isPreloading = true;
  try {
    const hasJsPdf = typeof (window as any).jspdf !== 'undefined' || typeof (window as any).jsPDF !== 'undefined';
    if (!hasJsPdf) {
      await loadScript(JSPDF_CDN);
    }

    const hasAutoTable =
      typeof (window as any).jspdf?.jsPDF?.prototype?.autoTable !== 'undefined' ||
      typeof (window as any).jsPDF?.prototype?.autoTable !== 'undefined';
    if (!hasAutoTable) {
      await loadScript(AUTOTABLE_CDN);
    }

    isLoaded = true;
    return true;
  } catch (error) {
    console.warn('[PDF] No se pudieron precargar las librerías de PDF:', error);
    return false;
  } finally {
    isPreloading = false;
  }
}

/**
 * Obtiene el constructor seguro de jsPDF sin importar cómo lo cargue el navegador.
 */
function getJsPdfConstructor(): any {
  if (typeof window === 'undefined') return null;
  return (window as any).jspdf?.jsPDF || (window as any).jsPDF || null;
}

/**
 * Genera y descarga el PDF del carrito con diseño profesional.
 */
export async function downloadCartPDF(
  items: CartItem[],
  customer: CustomerInfo,
  storeConfig: { name?: string; email?: string; phone?: string; website?: string } = {}
): Promise<boolean> {
  if (!items || items.length === 0) {
    alert('Tu carrito está vacío. Agrega productos antes de descargar el comprobante.');
    return false;
  }

  const storeName = storeConfig.name || 'FixStore';
  const storeEmail = storeConfig.email || 'julioricardo95@gmail.com';
  const storePhone = storeConfig.phone || '+50558567432';
  const orderId = generateOrderId();
  const dateStr = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const timeStr = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const { totalItems, total } = calculateTotals(items);

  // Asegurar que las librerías estén cargadas
  await preloadPdfLibraries();

  const JsPdfConstructor = getJsPdfConstructor();

  if (JsPdfConstructor) {
    try {
      const doc = new JsPdfConstructor({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // --- ENCABEZADO DE MARCA ---
      // Barra superior azul corporativa
      doc.setFillColor(37, 99, 235); // #2563eb
      doc.rect(0, 0, 210, 26, 'F');

      // Nombre de la Tienda
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text(storeName.toUpperCase(), 14, 16);

      // Etiqueta del Documento
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('PEDIDO / COTIZACIÓN', 196, 16, { align: 'right' });

      // --- METADATOS DEL PEDIDO ---
      doc.setTextColor(31, 41, 55);
      doc.setFontSize(10);

      doc.setFont('helvetica', 'bold');
      doc.text('N° de Pedido:', 14, 35);
      doc.setFont('helvetica', 'normal');
      doc.text(`#${orderId}`, 42, 35);

      doc.setFont('helvetica', 'bold');
      doc.text('Fecha y Hora:', 14, 41);
      doc.setFont('helvetica', 'normal');
      doc.text(`${dateStr} - ${timeStr}`, 42, 41);

      // --- DATOS DEL CLIENTE ---
      doc.setFillColor(248, 250, 252); // slate-50
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.roundedRect(14, 47, 182, 26, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      doc.text('Información del Comprador:', 18, 53);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`Cliente: ${customer.name?.trim() || 'Particular'}`, 18, 59);
      doc.text(`Teléfono: ${customer.phone?.trim() || 'No especificado'}`, 18, 65);
      doc.text(`Correo: ${customer.email?.trim() || 'No especificado'}`, 105, 59);
      doc.text(`Dirección: ${customer.address?.trim() || 'Entrega acordada'}`, 105, 65);

      // --- TABLA DE PRODUCTOS (Requisito: producto, cantidad, total) ---
      const tableData = items.map((item, index) => {
        const itemPrice = typeof item.PRECIO === 'number' ? item.PRECIO : parseFloat(String(item.PRECIO || 0)) || 0;
        const itemTotal = itemPrice * (item.quantity || 1);
        return [
          String(index + 1),
          item.TITULO || 'Producto',
          formatCurrency(itemPrice),
          String(item.quantity || 1),
          formatCurrency(itemTotal)
        ];
      });

      // Renderizar tabla con AutoTable
      if (typeof (doc as any).autoTable === 'function') {
        (doc as any).autoTable({
          startY: 79,
          head: [['#', 'Producto', 'P. Unitario', 'Cantidad', 'Total']],
          body: tableData,
          theme: 'striped',
          headStyles: {
            fillColor: [37, 99, 235],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'left',
            cellPadding: 3.5
          },
          columnStyles: {
            0: { cellWidth: 10, halign: 'center' },
            1: { cellWidth: 100 },
            2: { cellWidth: 26, halign: 'right' },
            3: { cellWidth: 20, halign: 'center' },
            4: { cellWidth: 26, halign: 'right', fontStyle: 'bold' }
          },
          styles: {
            fontSize: 9,
            cellPadding: 3,
            overflow: 'linebreak'
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252]
          }
        });
      }

      // Posición final de la tabla
      const finalY = (doc as any).lastAutoTable?.finalY || 140;

      // --- TARJETA DE RESUMEN DE TOTALES ---
      const summaryBoxX = 120;
      const summaryBoxY = finalY + 6;

      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(summaryBoxX, summaryBoxY, 76, 24, 2, 2, 'FD');

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text('Cantidad de Artículos:', summaryBoxX + 4, summaryBoxY + 8);
      doc.setFont('helvetica', 'bold');
      doc.text(String(totalItems), summaryBoxX + 72, summaryBoxY + 8, { align: 'right' });

      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('TOTAL A PAGAR:', summaryBoxX + 4, summaryBoxY + 18);
      doc.setFontSize(13);
      doc.setTextColor(37, 99, 235);
      doc.text(formatCurrency(total), summaryBoxX + 72, summaryBoxY + 18, { align: 'right' });

      // --- PIE DE PÁGINA Y CONTACTO ---
      const footerY = 270;
      doc.setDrawColor(226, 232, 240);
      doc.line(14, footerY, 196, footerY);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`¡Gracias por preferir ${storeName}! Si tienes dudas con tu pedido, contáctanos:`, 14, footerY + 5);
      doc.text(`Correo: ${storeEmail}  |  WhatsApp / Teléfono: ${storePhone}`, 14, footerY + 10);
      doc.text(`Comprobante digital autogenerado por la tienda online.`, 14, footerY + 15);

      // Guardar y descargar archivo en el navegador
      doc.save(`Pedido_${storeName}_${orderId}.pdf`);
      return true;
    } catch (err) {
      console.error('[PDF] Error construyendo el PDF con jsPDF:', err);
    }
  }

  // --- CONTINGENCIA SEGURA (FALLBACK SIN BLOQUEO DE POPUPS) ---
  // Genera un documento HTML descargable como recibo
  const fallbackHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Pedido_${storeName}_${orderId}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 30px; color: #1e293b; max-width: 800px; margin: auto; }
        .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
        .customer { background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin: 20px 0; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px; }
        th { background: #2563eb; color: white; padding: 10px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
        .total { text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold; color: #2563eb; }
      </style>
    </head>
    <body>
      <div class="header">
        <h2 style="margin:0">${storeName}</h2>
        <span>PEDIDO #${orderId}</span>
      </div>
      <div class="customer">
        <strong>Cliente:</strong> ${customer.name || 'Particular'}<br>
        <strong>Teléfono:</strong> ${customer.phone || 'N/A'} | <strong>Correo:</strong> ${customer.email || 'N/A'}<br>
        <strong>Fecha:</strong> ${dateStr} ${timeStr}
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Producto</th>
            <th style="text-align:right">P. Unitario</th>
            <th style="text-align:center">Cantidad</th>
            <th style="text-align:right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map((item, idx) => {
              const itemPrice = typeof item.PRECIO === 'number' ? item.PRECIO : parseFloat(String(item.PRECIO || 0)) || 0;
              return `
              <tr>
                <td>${idx + 1}</td>
                <td><strong>${item.TITULO}</strong></td>
                <td style="text-align:right">${formatCurrency(itemPrice)}</td>
                <td style="text-align:center">${item.quantity}</td>
                <td style="text-align:right;font-weight:bold">${formatCurrency(itemPrice * item.quantity)}</td>
              </tr>
            `;
            })
            .join('')}
        </tbody>
      </table>
      <div class="total">
        TOTAL A PAGAR: ${formatCurrency(total)}
      </div>
      <p style="margin-top:30px;font-size:12px;color:#64748b;text-align:center">
        ${storeName} - ${storeEmail} - ${storePhone}
      </p>
    </body>
    </html>
  `;

  const blob = new Blob([fallbackHtml], { type: 'text/html' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `Pedido_${storeName}_${orderId}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);

  return true;
}
