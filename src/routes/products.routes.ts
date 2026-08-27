import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import * as productsService from '../services/products.service.js';

export const productsRouter = Router();

productsRouter.use(requireAuth);

productsRouter.get('/mine', (req, res) => {
  res.json(productsService.getProductosDelCliente(req.clienteId!));
});

productsRouter.get('/catalog', (req, res) => {
  res.json(productsService.getCatalogo());
});
