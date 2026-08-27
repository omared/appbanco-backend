import { CLIENTES_FIXTURES } from '../data/clientes.fixtures.js';
import { CATALOGO_PRODUCTOS } from '../data/productos.fixtures.js';
import { SOLICITUDES_CLIENTE, siguienteRadicado } from '../data/solicitudes.fixtures.js';
import { DatosPersonales, SolicitudInput, SolicitudResumen } from '../models/solicitud.model.js';

export interface EnvioResult {
  ok: boolean;
  radicado?: string;
  error?: 'producto_no_encontrado';
}

export function getDatosPrecargados(clienteId: string): DatosPersonales | null {
  const fixture = CLIENTES_FIXTURES.find((f) => f.cliente.id === clienteId);
  if (!fixture) {
    return null;
  }
  const { nombre, documento, celular, correo } = fixture.cliente;
  return { nombre, documento, celular, correo };
}

export function enviarSolicitud(clienteId: string, solicitud: SolicitudInput): EnvioResult {
  const producto = CATALOGO_PRODUCTOS.find((p) => p.id === solicitud.productoId);
  if (!producto) {
    return { ok: false, error: 'producto_no_encontrado' };
  }

  const radicado = siguienteRadicado();
  const resumen: SolicitudResumen = {
    radicado,
    productoNombre: producto.nombre,
    estado: 'en_estudio',
    fechaEnvio: new Date().toISOString(),
  };
  const existentes = SOLICITUDES_CLIENTE[clienteId] ?? [];
  SOLICITUDES_CLIENTE[clienteId] = [...existentes, resumen];
  return { ok: true, radicado };
}

export function getMisSolicitudes(clienteId: string): SolicitudResumen[] {
  return SOLICITUDES_CLIENTE[clienteId] ?? [];
}
