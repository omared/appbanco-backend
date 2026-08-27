import { Router } from 'express';
import * as authService from '../services/auth.service.js';

export const authRouter = Router();

authRouter.post('/login', (req, res) => {
  const { documento, password } = req.body ?? {};

  if (typeof documento !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'documento_y_password_requeridos' });
    return;
  }

  const resultado = authService.login(documento, password);
  res.status(resultado.ok ? 200 : 401).json(resultado);
});

authRouter.post('/logout', (req, res) => {
  const header = req.header('authorization') ?? '';
  const [, token] = header.split(' ');
  if (token) {
    authService.logout(token);
  }
  res.status(204).send();
});
