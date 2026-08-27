import { CATALOGO_PRODUCTOS, PRODUCTOS_CLIENTE } from '../data/productos.fixtures.js';
import { ProductoCatalogo, ProductoCliente } from '../models/producto.model.js';

export function getProductosDelCliente(clienteId: string): ProductoCliente[] {
  return PRODUCTOS_CLIENTE[clienteId] ?? [];
}

export function getCatalogo(): ProductoCatalogo[] {
  return CATALOGO_PRODUCTOS;
}
