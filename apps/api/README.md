# GoTicket — API / KAN-53

NestJS 11, PostgreSQL 14 local y Prisma 7.10.1 con `@prisma/adapter-pg`.
No requiere Docker. Este ticket incorpora persistencia y usuarios, sin registro,
login, JWT, roles ni organizaciones. El endpoint temporal `GET /users` fue retirado.
`UsersService` queda disponible para las siguientes entregas y sus pruebas.

## Configuración local

Desde la raíz, instalar con `pnpm install --frozen-lockfile`. Luego, en `apps/api`:

1. Copiar `.env.example` a `.env` y completar las credenciales locales.
2. Usar `goticket` como base de desarrollo y `goticket_shadow` como shadow para
   `prisma migrate dev`. No usar ninguna de ellas para integración.
3. `pnpm prisma:generate` genera el cliente en `generated/prisma` (ignorado).
4. `pnpm exec prisma migrate deploy` aplica migraciones pendientes. No ejecutar
   `migrate reset` sobre la base de desarrollo.
5. `pnpm prisma:status` comprueba el estado sin modificar usuarios.
6. `pnpm dev` inicia la API; `GET /health` responde `{ "status": "ok" }`.

La API, Prisma CLI y el seeder cargan `.env` desde el directorio `apps/api`.
Las variables exportadas tienen prioridad. El build genera el cliente sin requerir
conexión a PostgreSQL; iniciar la API sí exige `DATABASE_URL` válida.

```sh
pnpm build
pnpm start:prod
```

Con el cliente generado fuera de `src`, el entrypoint compilado es
`dist/src/main.js`. El build incluye `src` y sus imports generados, pero no el
seeder, la configuración de Prisma ni los tests.

## Modelo

`users`: UUID, email único (`VARCHAR(255)`), `password_hash` (`VARCHAR(255)`),
`created_at` y `updated_at`. Migración: `20261112201421_create_users`.
`UsersService.findAll()` selecciona solo `id`, `email` y `createdAt`; nunca retorna
`passwordHash`. No hay controller público de usuarios.

La restricción UNIQUE actual respeta la comparación normal de PostgreSQL: no
normaliza mayúsculas ni espacios del correo. La política de normalización de un
futuro registro pertenece a su propio ticket.

## Seeder local, opt-in

Configurar **solo en el entorno local o en `.env` ignorado**:

- `NODE_ENV=development` (o `test` para `goticket_test`).
- `ALLOW_USER_SEED=true` (el ejemplo lo deja deshabilitado).
- `SEED_USER_PASSWORD`: contraseña local de al menos 12 caracteres y máximo 72
  bytes UTF-8. No se incluye ninguna contraseña de prueba en el repositorio.
- `DATABASE_URL`: PostgreSQL local, base `goticket` o `goticket_test`, schema public.

Ejecutar `pnpm seed`. El script rechaza producción, entornos no declarados,
destinos remotos, shadow y configuraciones incompletas **antes de conectarse**.
No imprime credenciales ni errores crudos de conexión.

Crea cinco usuarios ficticios con bcrypt (coste 12), mediante upserts en una
transacción. Repetirlo no cambia IDs, timestamps ni hashes existentes, incluso si
se cambia la contraseña de seed. No es una herramienta de cambio de contraseñas.

## Tests unitarios y HTTP

Desde la raíz:

```sh
pnpm --filter ./apps/api test --runInBand
pnpm --filter ./apps/api test:e2e --runInBand
```

Los unitarios validan la selección de campos, errores y protecciones del seed/test.
Los HTTP sustituyen únicamente `PrismaService` por un proveedor sin conexión para
probar `/`, `/health` y la ausencia de `/users`. No se usan para afirmar que UNIQUE
funciona; esa validación se realiza con PostgreSQL real.

## Integración PostgreSQL real e independiente

### Opción recomendada: clúster temporal local

Requiere binarios PostgreSQL 14 (`initdb`, `pg_ctl`, `createdb`, `pg_config`), Bash,
Node y ejecución como usuario normal (PostgreSQL no permite `initdb` como root).
Desde la raíz:

```sh
pnpm --filter ./apps/api test:integration:local
```

El runner crea un clúster independiente bajo `/tmp`, en `127.0.0.1:55453`, con
base `goticket_test`, usuario y contraseña aleatoria de corta duración. Aplica la
migración, verifica su estado, ejecuta Jest y elimina el clúster al finalizar,
incluso si fallan los tests. No administra la instancia PostgreSQL del sistema ni
contenedores. La contraseña se guarda temporalmente con permisos `0600` en un
directorio privado, sin escribirse en el repositorio.

Se pueden definir `PG_BIN` para la ruta de binarios y `TEST_POSTGRES_PORT` para un
puerto libre. Si el puerto está ocupado, el runner falla sin detener otros servicios.

### Alternativa: base de pruebas persistente

Un administrador debe crear **otra base**, con el rol local de la aplicación como
owner. Sustituir `ROL_LOCAL` por ese nombre, sin incluir contraseñas en comandos:

```sh
sudo -u postgres createdb --owner=ROL_LOCAL goticket_test
```

Configurar `TEST_DATABASE_URL` en `apps/api/.env.test` (ignorado) con ese destino.
No se admite `DATABASE_URL` como fallback. Luego:

```sh
pnpm --filter ./apps/api test:integration
```

Solo acepta PostgreSQL local, base exactamente `goticket_test`, schema public.
Antes de escribir, el suite verifica también `current_database()` en el servidor.
Se ejecuta `migrate deploy`, nunca `reset`; el teardown borra solo IDs creados por
el propio suite. Si los cinco emails del seeder ya existen en esta base, la prueba
falla sin modificarlos: usar el runner temporal, no borrar datos ajenos.

La integración cubre creación/recuperación, hashes bcrypt persistidos y comparación
de contraseñas, proyección segura, UNIQUE con creaciones concurrentes y seed
idempotente (incluidos IDs, timestamps y hashes). Las contraseñas de tests se
generan en memoria. Jest requiere `--experimental-vm-modules` por los imports
dinámicos del compilador WASM de Prisma 7; el runner lo configura automáticamente.

## Validaciones y entrega

```sh
pnpm --filter ./apps/api lint
pnpm --filter ./apps/api prisma:validate
pnpm --filter ./apps/api prisma:status
pnpm --filter ./apps/api build
git diff --check
```

Resultado de KAN-53: 28 tests unitarios (30 assertions Jest), 4 de integración
PostgreSQL (31 assertions) y 3 HTTP (6 assertions): **35 tests, 67 assertions**.
Build, ESLint sin warnings, validación de esquema y estado de migraciones correctos.
Se verificó que los cinco usuarios originales de `goticket` conservaran la misma
huella SHA-256 antes y después, sin exponer sus registros ni hashes.

Incluir configuración y código de `apps/api`, migración, tests y el lockfile raíz
(Prisma y dependencias requieren actualizarlo). No incluir `.env`, `.env.test`,
credenciales, `generated/`, `dist/`, `coverage/` ni reportes locales de pruebas.
Los reportes JSON usados para contar assertions quedan en `/tmp`.
