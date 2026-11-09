# GoTicket!

Monorepo de GoTicket!, con una API NestJS 11 + TypeScript y una aplicación web Vue 3 + TypeScript. Infraestructura inicial correspondiente a Jira **KAN-52**.

## Requisitos

- Node.js `^22.18.0 || >=24.12.0` (se recomienda Node.js 24 LTS).
- pnpm **10.34.9**, indicado en `packageManager` del `package.json` raíz.

## Estructura

```text
apps/
  api/                 # API NestJS
  web/                 # Frontend Vue 3 con Vite
docs/                  # Documentación
infra/                 # Infraestructura
pnpm-workspace.yaml    # Definición del workspace
pnpm-lock.yaml         # Único lockfile del monorepo
```

## Instalación

Desde la raíz del repositorio:

```sh
pnpm install --frozen-lockfile
```

## Desarrollo

```sh
pnpm dev              # API y web en paralelo
pnpm dev:api          # Solo API
pnpm dev:web          # Solo web
```

- API: <http://localhost:3000>.
- Health check: `GET http://localhost:3000/health`, responde HTTP 200 con `{"status":"ok"}`.
- Web: <http://localhost:5173> (Vite puede elegir otro puerto si está ocupado).

La API usa el puerto `3000` por defecto y permite cambiarlo mediante la variable de entorno `PORT`:

```sh
PORT=3001 pnpm dev:api
```

`apps/api/.env.example` documenta esta variable sin secretos. No es necesario crear un `.env` para iniciar el proyecto; la API no carga archivos `.env` automáticamente. Los archivos `.env` reales están ignorados por Git.

## Build

```sh
pnpm build            # Compila ambas aplicaciones; incluye chequeo de tipos web
```

Los resultados se generan en `apps/api/dist/` y `apps/web/dist/`.

## Tests

Ejecutar desde la raíz, sin modo watch:

```sh
pnpm --filter ./apps/api test --runInBand
pnpm --filter ./apps/api test:e2e --runInBand
pnpm --filter ./apps/web test:unit --run
```

La API usa Jest para tests unitarios y Supertest para pruebas HTTP; la web usa Vitest y Vue Test Utils.
