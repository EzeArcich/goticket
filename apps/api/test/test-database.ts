import { config } from 'dotenv';

export function testDatabaseUrl(env: NodeJS.ProcessEnv = process.env): string {
  const raw = env.TEST_DATABASE_URL;
  if (!raw)
    throw new Error(
      'Configurá TEST_DATABASE_URL en .env.test o usá test:integration:local',
    );
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error('TEST_DATABASE_URL inválida');
  }
  if (
    !['postgres:', 'postgresql:'].includes(url.protocol) ||
    !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) ||
    decodeURIComponent(url.pathname) !== '/goticket_test' ||
    [...url.searchParams.keys()].some((key) => key !== 'schema') ||
    (url.searchParams.has('schema') &&
      url.searchParams.get('schema') !== 'public')
  ) {
    throw new Error(
      'Tests restringidos a PostgreSQL local goticket_test, schema public',
    );
  }
  return raw;
}

export function loadTestEnvironment(): string {
  // Nunca tomar DATABASE_URL de .env como fallback.
  config({ path: '.env.test', quiet: true });
  const url = testDatabaseUrl();
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = url;
  delete process.env.SHADOW_DATABASE_URL;
  return url;
}
