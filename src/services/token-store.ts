import { randomUUID } from 'node:crypto';

interface TokenRecord {
  clienteId: string;
  createdAt: number;
}

const TOKEN_TTL_MS = 60 * 60 * 1000;

const tokens = new Map<string, TokenRecord>();

export function emitirToken(clienteId: string): string {
  const token = randomUUID();
  tokens.set(token, { clienteId, createdAt: Date.now() });
  return token;
}

export function resolverToken(token: string): string | null {
  const record = tokens.get(token);
  if (!record) {
    return null;
  }
  if (Date.now() - record.createdAt > TOKEN_TTL_MS) {
    tokens.delete(token);
    return null;
  }
  return record.clienteId;
}

export function revocarToken(token: string): void {
  tokens.delete(token);
}
