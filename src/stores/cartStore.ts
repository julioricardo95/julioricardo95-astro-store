/**
 * src/stores/cartStore.ts
 * Gestor global de estado reactivo y modular para el carrito de compras (FixStore).
 * 
 * Mejoras y Optimizaciones:
 * - Persistencia nativa robusta en localStorage con control de excepciones y validación de cuotas.
 * - Validación defensiva de datos (precios numéricos, strings con formato '$', cantidades 1-99).
 * - Sincronización multi-pestaña en tiempo real mediante el evento 'storage'.
 * - Compatibilidad nativa con el ciclo de vida de navegación de Astro ('astro:page-load').
 * - Store reactivo para Notificaciones Toast flotantes ($cartToast).
 * - Aliases de retrocompatibilidad (addCartItem, removeCartItem).
 */

import { atom } from 'nanostores';
import type { CartItem, CustomerInfo } from '../types/cart';

// Claves seguras de almacenamiento local
const CART_STORAGE_KEY = 'fixstore_cart_v1';
const CUSTOMER_STORAGE_KEY = 'fixstore_customer_v1';

/**
 * Lee de forma segura el carrito desde localStorage evitando desajustes de SSR.
 */
function getInitialCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Validar y sanear cada artículo recuperado
    return parsed
      .filter((item) => item && typeof item === 'object' && item.id != null)
      .map((item) => ({
        ...item,
        quantity: Math.max(1, Math.min(99, parseInt(String(item.quantity || 1), 10) || 1)),
        PRECIO: typeof item.PRECIO === 'number' ? item.PRECIO : parseFloat(String(item.PRECIO || 0)) || 0
      }));
  } catch (error) {
    console.warn('[CartStore] No se pudo leer el carrito de localStorage:', error);
    return [];
  }
}

/**
 * Recupera de forma segura los datos previos del comprador.
 */
function getInitialCustomer(): CustomerInfo {
  const defaultInfo: CustomerInfo = {
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  };
  if (typeof window === 'undefined') return defaultInfo;
  try {
    const raw = localStorage.getItem(CUSTOMER_STORAGE_KEY);
    if (!raw) return defaultInfo;
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? { ...defaultInfo, ...parsed } : defaultInfo;
  } catch {
    return defaultInfo;
  }
}

// ==========================================
// ÁTOMOS REACTIVOS (STORES)
// ==========================================

/** Lista reactiva de productos en el carrito */
export const $cart = atom<CartItem[]>(getInitialCart());

/** Control de apertura/cierre del cajón lateral */
export const $isCartOpen = atom<boolean>(false);

/** Datos del cliente para envíos y facturación */
export const $customerInfo = atom<CustomerInfo>(getInitialCustomer());

/** Estado para notificación Toast flotante tras añadir un producto */
export interface CartToastState {
  id: string;
  visible: boolean;
  productName: string;
  productImage?: string;
  quantity: number;
}
export const $cartToast = atom<CartToastState | null>(null);

// Temporizador interno para autocierre del toast
let toastTimer: any = null;

// ==========================================
// SUSCRIPCIONES Y SINCRONIZACIÓN DE ESTADO
// ==========================================

if (typeof window !== 'undefined') {
  // 1. Guardar en localStorage de forma reactiva
  $cart.subscribe((items) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.warn('[CartStore] QuotaExceeded o error al persistir el carrito:', error);
    }
  });

  // 2. Persistir datos del comprador
  $customerInfo.subscribe((info) => {
    try {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(info));
    } catch (error) {
      console.warn('[CartStore] Error al persistir datos del cliente:', error);
    }
  });

  // 3. Sincronización en tiempo real entre múltiples pestañas del navegador
  window.addEventListener('storage', (event) => {
    if (event.key === CART_STORAGE_KEY && event.newValue) {
      try {
        const updated = JSON.parse(event.newValue);
        if (Array.isArray(updated)) {
          $cart.set(updated);
        }
      } catch (err) {
        console.warn('[CartStore] Error parseando actualización remota de pestaña:', err);
      }
    }
  });

  // 4. Asegurar estado fresco durante navegación client-side con Astro View Transitions
  document.addEventListener('astro:page-load', () => {
    const fresh = getInitialCart();
    $cart.set(fresh);
  });

  // 5. Escucha de eventos globales lanzados desde scripts vanilla de Astro o plantillas HTML
  window.addEventListener('fixstore:add-to-cart', (event: any) => {
    if (event.detail?.product) {
      addToCart(
        event.detail.product,
        event.detail.quantity || 1,
        event.detail.autoOpen ?? false,
        event.detail.showToast ?? true
      );
    }
  });

  // 6. Exposición de API pública en window para depuración o scripts tradicionales
  (window as any).fixstoreCart = {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    $cart
  };
}

// ==========================================
// UTILIDADES INTERNAS Y NORMALIZACIÓN
// ==========================================

/**
 * Normaliza cualquier objeto producto (Astro, JSON, o React) a una estructura CartItem tipada y segura.
 */
function normalizeProduct(product: any): CartItem {
  const id = product.id ?? product.ID ?? `prod-${Date.now()}`;
  const TITULO = String(product.TITULO ?? product.titulo ?? product.title ?? 'Producto sin título').trim();
  
  // Limpieza defensiva del precio (soporta números, "$30.00", strings con comas, etc.)
  let PRECIO = 0;
  if (typeof product.PRECIO === 'number') {
    PRECIO = product.PRECIO;
  } else if (typeof product.precio === 'number') {
    PRECIO = product.precio;
  } else {
    const raw = String(product.PRECIO ?? product.precio ?? product.price ?? 0);
    PRECIO = parseFloat(raw.replace(/[^0-9.]/g, '')) || 0;
  }

  // Normalización de imágenes
  let IMG: string[] = [];
  if (Array.isArray(product.IMG) && product.IMG.length > 0) {
    IMG = product.IMG;
  } else if (Array.isArray(product.img) && product.img.length > 0) {
    IMG = product.img;
  } else if (typeof product.IMG === 'string' && product.IMG) {
    IMG = [product.IMG];
  } else if (typeof product.img === 'string' && product.img) {
    IMG = [product.img];
  } else {
    IMG = ['https://via.placeholder.com/300?text=Sin+Imagen'];
  }

  const CATEGORIA = String(product.CATEGORIA ?? product.categoria ?? '').trim();
  const DESCRIPCION = String(product.DESCRIPCION ?? product.descripcion ?? '').trim();

  return {
    id,
    TITULO,
    PRECIO,
    IMG,
    CATEGORIA,
    DESCRIPCION,
    quantity: 1,
    ...product
  };
}

// ==========================================
// ACCIONES MODULARES DEL STORE
// ==========================================

/**
 * Añade un producto al carrito o incrementa su cantidad.
 * 
 * @param product Objeto del producto a agregar
 * @param quantity Cantidad a incorporar (por defecto 1, rango 1-99)
 * @param autoOpen Si es true, abre el cajón lateral inmediatamente
 * @param showToast Si es true, dispara el Toast flotante de confirmación
 */
export function addToCart(
  product: any,
  quantity: number = 1,
  autoOpen: boolean = false,
  showToast: boolean = true
): void {
  if (!product) return;

  const validQty = Math.max(1, Math.min(99, Math.floor(quantity) || 1));
  const normalized = normalizeProduct(product);
  const currentItems = $cart.get();
  const existingIndex = currentItems.findIndex((item) => String(item.id) === String(normalized.id));

  let updated: CartItem[];

  if (existingIndex > -1) {
    // Si ya existe en el carrito, se acumula hasta un tope de 99 unidades
    updated = currentItems.map((item, index) => {
      if (index === existingIndex) {
        const nextQty = Math.min(99, item.quantity + validQty);
        return { ...item, quantity: nextQty };
      }
      return item;
    });
  } else {
    // Se inserta como nuevo elemento al inicio
    updated = [{ ...normalized, quantity: validQty }, ...currentItems];
  }

  $cart.set(updated);

  // Abrir cajón si está configurado
  if (autoOpen) {
    $isCartOpen.set(true);
  }

  // Disparar feedback Toast flotante
  if (showToast) {
    triggerToast(normalized.TITULO, normalized.IMG?.[0], validQty);
  }
}

/** Dispara una notificación Toast flotante con autocierre */
function triggerToast(productName: string, productImage?: string, quantity: number = 1): void {
  if (toastTimer) clearTimeout(toastTimer);

  $cartToast.set({
    id: `toast-${Date.now()}`,
    visible: true,
    productName,
    productImage,
    quantity
  });

  toastTimer = setTimeout(() => {
    $cartToast.set(null);
  }, 3500);
}

/** Cierra manualmente la notificación Toast */
export function dismissToast(): void {
  if (toastTimer) clearTimeout(toastTimer);
  $cartToast.set(null);
}

// Alias de retrocompatibilidad
export const addCartItem = addToCart;

/**
 * Elimina un producto del carrito por su ID.
 */
export function removeFromCart(productId: string | number): void {
  const currentItems = $cart.get();
  const updated = currentItems.filter((item) => String(item.id) !== String(productId));
  $cart.set(updated);
}

// Alias de retrocompatibilidad
export const removeCartItem = removeFromCart;

/**
 * Modifica la cantidad exacta de un artículo (rango: 1 a 99).
 * Si la cantidad enviada es 0 o negativa, el producto se elimina.
 */
export function updateQuantity(productId: string | number, newQuantity: number): void {
  if (newQuantity <= 0) {
    removeFromCart(productId);
    return;
  }

  const boundedQuantity = Math.min(99, Math.max(1, Math.floor(newQuantity)));
  const currentItems = $cart.get();
  const updated = currentItems.map((item) => {
    if (String(item.id) === String(productId)) {
      return {
        ...item,
        quantity: boundedQuantity
      };
    }
    return item;
  });

  $cart.set(updated);
}

/**
 * Vacía la totalidad de los artículos en el carrito.
 */
export function clearCart(): void {
  $cart.set([]);
}

/** Abre el cajón lateral del carrito */
export function openCart(): void {
  $isCartOpen.set(true);
}

/** Cierra el cajón lateral del carrito */
export function closeCart(): void {
  $isCartOpen.set(false);
}

/** Alterna la visibilidad del cajón lateral */
export function toggleCart(): void {
  $isCartOpen.set(!$isCartOpen.get());
}

/**
 * Actualiza los datos de contacto y entrega del comprador.
 */
export function updateCustomerInfo(partial: Partial<CustomerInfo>): void {
  $customerInfo.set({
    ...$customerInfo.get(),
    ...partial
  });
}

// ==========================================
// CÁLCULOS Y TOTALIZACIÓN
// ==========================================

/**
 * Computa de forma pura los totales del carrito:
 * - totalItems: suma de cantidades
 * - subtotal: valor neto acumulado
 * - total: gran total
 */
export function calculateTotals(items: CartItem[]) {
  const list = Array.isArray(items) ? items : [];
  const totalItems = list.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const total = list.reduce((acc, item) => {
    const itemPrice = typeof item.PRECIO === 'number' ? item.PRECIO : parseFloat(String(item.PRECIO || 0)) || 0;
    const itemQty = item.quantity || 1;
    return acc + itemPrice * itemQty;
  }, 0);

  return {
    totalItems,
    subtotal: total,
    shipping: 0,
    total
  };
}
