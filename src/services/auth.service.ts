import { CLIENTES_FIXTURES } from '../data/clientes.fixtures.js';
import { Cliente } from '../models/cliente.model.js';
import { emitirToken, revocarToken } from './token-store.js';

const BLOQUEO_TRAS_INTENTOS = 3;
const BLOQUEO_DURACION_MS = 30 * 60 * 1000;

export interface LoginResult {
  ok: boolean;
  cliente?: Cliente;
  token?: string;
  error?: 'credenciales_invalidas' | 'usuario_bloqueado';
  bloqueadoHasta?: string;
}

export function login(documento: string, password: string): LoginResult {
  const fixture = CLIENTES_FIXTURES.find((f) => f.cliente.documento === documento);

  if (!fixture) {
    return { ok: false, error: 'credenciales_invalidas' };
  }

  if (fixture.bloqueadoHasta && Date.now() < Date.parse(fixture.bloqueadoHasta)) {
    return { ok: false, error: 'usuario_bloqueado', bloqueadoHasta: fixture.bloqueadoHasta };
  }

  if (fixture.password !== password) {
    fixture.intentosFallidos += 1;
    if (fixture.intentosFallidos >= BLOQUEO_TRAS_INTENTOS) {
      fixture.bloqueadoHasta = new Date(Date.now() + BLOQUEO_DURACION_MS).toISOString();
      return { ok: false, error: 'usuario_bloqueado', bloqueadoHasta: fixture.bloqueadoHasta };
    }
    return { ok: false, error: 'credenciales_invalidas' };
  }

  fixture.intentosFallidos = 0;
  fixture.bloqueadoHasta = null;
  const token = emitirToken(fixture.cliente.id);
  return { ok: true, cliente: fixture.cliente, token };
}

export function logout(token: string): void {
  revocarToken(token);
}
