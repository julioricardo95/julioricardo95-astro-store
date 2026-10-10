/**
 * src/types/cart.ts
 * Definición de tipos de datos para el carrito de compras, cliente y pedidos.
 */

export interface CartItem {
  id: string | number;
  TITULO: string;
  PRECIO: number;
  IMG?: string[];
  CATEGORIA?: string;
  DESCRIPCION?: string;
  quantity: number;
  [key: string]: any;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
}

export interface OrderSummary {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;
  orderNumber: string;
  date: string;
}

