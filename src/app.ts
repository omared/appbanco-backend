import cors from 'cors';
import express, { Express } from 'express';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { authRouter } from './routes/auth.routes.js';
import { productsRouter } from './routes/products.routes.js';
import { requestsRouter } from './routes/requests.routes.js';

export function createApp(allowedOrigin: string): Express {
  const app = express();

  app.use(cors({ origin: allowedOrigin }));
  app.use(express.json());

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/products', productsRouter);
  app.use('/api/requests', requestsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
