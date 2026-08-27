import { NextFunction, Request, Response } from 'express';
import { resolverToken } from '../services/token-store.js';

declare global {
  namespace Express {
    interface Request {
      clienteId?: string;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.header('authorization') ?? '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    res.status(401).json({ error: 'no_autenticado' });
    return;
  }

  const clienteId = resolverToken(token);
  if (!clienteId) {
    res.status(401).json({ error: 'token_invalido' });
    return;
  }

  req.clienteId = clienteId;
  next();
}
