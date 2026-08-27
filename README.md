# appbanco-backend

API REST en Node.js + Express + TypeScript para la app [appbanco](../appbanco). Reemplaza el
`MockBackendService` en memoria del frontend con un servicio HTTP real, manteniendo el mismo
dominio (clientes, catálogo de productos, solicitudes) y las mismas reglas de negocio (bloqueo de
usuario tras 3 intentos fallidos, radicados secuenciales, etc.).

Los datos viven en memoria (`src/data/*.fixtures.ts`) — no hay base de datos todavía. Al reiniciar
el proceso se reinician también los datos a su estado inicial.

## Comandos

- `npm install` — instala dependencias.
- `npm run dev` — levanta el servidor con recarga en vivo (`tsx watch`) en `http://localhost:4000`.
- `npm run build` — compila TypeScript a `dist/`.
- `npm start` — ejecuta el build compilado (`node dist/index.js`).
- `npm test` — corre los tests con Vitest + Supertest.

Copia `.env.example` a `.env` para ajustar `PORT` y `ALLOWED_ORIGIN` (el origen del frontend
permitido por CORS; por defecto `http://localhost:4200`).

## Autenticación

Login devuelve un `token` opaco (UUID) que expira en 1 hora. Las rutas de productos y solicitudes
requieren el header `Authorization: Bearer <token>`; el `clienteId` se resuelve del token en el
servidor, nunca se recibe del cliente.

Credenciales de prueba (mismas del frontend):

| documento    | password     | notas                          |
| ------------ | ------------ | ------------------------------- |
| 1000000001   | Banco2026!   | cliente con productos activos   |
| 1000000002   | Banco2026!   | cliente sin productos activos   |

## Endpoints

| Método | Ruta                    | Auth | Descripción                                  |
| ------ | ----------------------- | ---- | --------------------------------------------- |
| GET    | `/api/health`           | No   | Chequeo de disponibilidad                     |
| POST   | `/api/auth/login`       | No   | `{ documento, password }` → cliente + token   |
| POST   | `/api/auth/logout`      | No   | Revoca el token enviado en `Authorization`    |
| GET    | `/api/products/mine`    | Sí   | Productos activos del cliente autenticado     |
| GET    | `/api/products/catalog` | Sí   | Catálogo de productos disponibles para adquirir |
| GET    | `/api/requests/prefill` | Sí   | Datos personales precargados para el formulario |
| POST   | `/api/requests`         | Sí   | Envía una solicitud de producto               |
| GET    | `/api/requests/mine`    | Sí   | Solicitudes del cliente autenticado           |

## Integrar con el frontend

El Angular actual (`appbanco/src/app/core/mock-api/mock-backend.service.ts` y los servicios que lo
usan) sigue funcionando en memoria por ahora — este backend es independiente y no está conectado
todavía. Para consumirlo desde Angular habría que reemplazar `AuthService`, `ProductsService` y
`RequestsService` por versiones que usen `HttpClient` contra estas rutas, guardando el `token` en
`SessionService` y enviándolo en cada request.
