import { hash } from 'bcrypt';
import type { PrismaClient } from '../generated/prisma/client';

export const seedEmails = [
  'lucia.fernandez@example.com',
  'martin.gonzalez@example.com',
  'valentina.romero@example.com',
  'tomas.pereyra@example.com',
  'camila.torres@example.com',
] as const;

export function validateSeedEnvironment(env: NodeJS.ProcessEnv): {
  connectionString: string;
  password: string;
} {
  if (!['development', 'test'].includes(env.NODE_ENV ?? '')) {
    throw new Error('Seeder permitido solo con NODE_ENV=development o test');
  }
  if (env.ALLOW_USER_SEED !== 'true') {
    throw new Error('El seeder requiere ALLOW_USER_SEED=true');
  }
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL no está configurada');
  }
  let url: URL;
  try {
    url = new URL(env.DATABASE_URL);
  } catch {
    throw new Error('DATABASE_URL inválida');
  }
  if (
    !['postgres:', 'postgresql:'].includes(url.protocol) ||
    !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) ||
    !['/goticket', '/goticket_test'].includes(url.pathname) ||
    [...url.searchParams.keys()].some((key) => key !== 'schema') ||
    (url.searchParams.has('schema') &&
      url.searchParams.get('schema') !== 'public')
  ) {
    throw new Error(
      'Seeder restringido a PostgreSQL local: goticket o goticket_test, schema public',
    );
  }
  if (env.NODE_ENV === 'test' && url.pathname !== '/goticket_test') {
    throw new Error('El seeder de test requiere goticket_test');
  }
  if (!env.SEED_USER_PASSWORD || env.SEED_USER_PASSWORD.trim().length < 12) {
    throw new Error('SEED_USER_PASSWORD debe tener al menos 12 caracteres');
  }
  if (Buffer.byteLength(env.SEED_USER_PASSWORD, 'utf8') > 72) {
    throw new Error(
      'SEED_USER_PASSWORD supera el límite de 72 bytes de bcrypt',
    );
  }
  return {
    connectionString: env.DATABASE_URL,
    password: env.SEED_USER_PASSWORD,
  };
}

/** No actualiza contraseñas ni timestamps de usuarios ya existentes. */
export async function seedUsers(
  prisma: PrismaClient,
  password: string,
): Promise<void> {
  const passwordHash = await hash(password, 12);
  await prisma.$transaction(
    seedEmails.map((email) =>
      prisma.user.upsert({
        where: { email },
        update: {},
        create: { email, passwordHash },
      }),
    ),
  );
}
