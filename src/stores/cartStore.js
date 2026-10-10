/**
 * src/stores/cartStore.js
 * Re-exportación unificada desde cartStore.ts.
 * 
 * Garantiza una única instancia reactiva de átomos en memoria en toda la aplicación,
 * evitando discrepancias de estado entre archivos .jsx, .tsx y .astro.
 */

export * from './cartStore.ts';
export { addCartItem, removeCartItem } from './cartStore.ts';