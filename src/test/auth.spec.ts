import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../app.js';

const app = createApp('http://localhost:4200');

describe('POST /api/auth/login', () => {
  it('devuelve token y cliente con credenciales válidas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ documento: '1000000001', password: 'Banco2026!' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.token).toBeTypeOf('string');
    expect(res.body.cliente.documento).toBe('1000000001');
  });

  it('rechaza credenciales inválidas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ documento: '1000000001', password: 'incorrecta' });

    expect(res.status).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.error).toBe('credenciales_invalidas');
  });

  it('bloquea al cliente tras 3 intentos fallidos', async () => {
    const documento = '1000000002';
    for (let i = 0; i < 3; i++) {
      await request(app).post('/api/auth/login').send({ documento, password: 'mala' });
    }

    const res = await request(app)
      .post('/api/auth/login')
      .send({ documento, password: 'mala' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('usuario_bloqueado');
    expect(res.body.bloqueadoHasta).toBeTypeOf('string');
  });
});

describe('rutas protegidas', () => {
  it('rechaza el catálogo sin token', async () => {
    const res = await request(app).get('/api/products/catalog');
    expect(res.status).toBe(401);
  });

  it('devuelve el catálogo con token válido', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ documento: '1000000001', password: 'Banco2026!' });

    const res = await request(app)
      .get('/api/products/catalog')
      .set('Authorization', `Bearer ${login.body.token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
