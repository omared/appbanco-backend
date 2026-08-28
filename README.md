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

El frontend [appbanco](https://github.com/omared/appbanco) ya está conectado: `AuthService`,
`ProductsService` y `RequestsService` usan `HttpClient` contra estas rutas, con un interceptor que
adjunta el `token` guardado en `SessionService` como header `Authorization: Bearer`. La URL base se
controla con `environment.apiUrl` (`http://localhost:4000/api` en desarrollo).

## Deploy (Render)

El repo incluye un blueprint (`render.yaml`) para desplegar como Web Service en
[Render](https://render.com):

1. Entra a Render con tu cuenta de GitHub.
2. **New +** → **Blueprint** → selecciona el repo `appbanco-backend`.
3. Render lee `render.yaml` y crea el servicio (`npm ci && npm run build` / `npm start`, plan free).
4. Click **Apply**. Al terminar el deploy, Render asigna una URL pública (algo como
   `https://appbanco-backend.onrender.com`).

`ALLOWED_ORIGIN` ya viene preconfigurado en `render.yaml` apuntando a
`https://omared.github.io` (el origen de GitHub Pages del frontend). Si el frontend se sirve desde
otro dominio, actualiza esa variable en el dashboard de Render.

El plan free "duerme" el servicio tras ~15 min sin tráfico; la primera petición después de eso
tarda 30-50s en responder mientras arranca de nuevo.

Una vez desplegado, actualiza `environment.ts` (producción) del frontend con la URL real de Render
y vuelve a publicar GitHub Pages.
