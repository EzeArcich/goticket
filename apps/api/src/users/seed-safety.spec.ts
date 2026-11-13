import { randomBytes } from 'node:crypto';
import { validateSeedEnvironment } from '../../prisma/seed-users';
import { testDatabaseUrl } from '../../test/test-database';

const password = randomBytes(24).toString('hex');
const valid = {
  NODE_ENV: 'test',
  ALLOW_USER_SEED: 'true',
  DATABASE_URL: 'postgresql://localhost/goticket_test',
  SEED_USER_PASSWORD: password,
};

describe('seed safeguards', () => {
  it('allows explicitly enabled local test seeds', () => {
    expect(validateSeedEnvironment(valid)).toEqual({
      connectionString: valid.DATABASE_URL,
      password,
    });
  });
  it.each(['production', '', 'staging'])(
    'refuses environment %s',
    (NODE_ENV) => {
      expect(() => validateSeedEnvironment({ ...valid, NODE_ENV })).toThrow();
    },
  );
  it.each([
    { ALLOW_USER_SEED: undefined },
    { DATABASE_URL: undefined },
    { DATABASE_URL: 'not-a-url' },
    { DATABASE_URL: 'postgresql://remote.example/goticket_test' },
    { DATABASE_URL: 'postgresql://localhost/goticket_shadow' },
    { DATABASE_URL: 'postgresql://localhost/goticket' },
    {
      DATABASE_URL: 'postgresql://localhost/goticket_test?host=remote.example',
    },
    { DATABASE_URL: 'postgresql://localhost/goticket_test?schema=private' },
    { SEED_USER_PASSWORD: undefined },
    { SEED_USER_PASSWORD: ' ' },
    { SEED_USER_PASSWORD: randomBytes(40).toString('hex') },
  ])('refuses unsafe or incomplete seed configuration %#', (changes) => {
    expect(() => validateSeedEnvironment({ ...valid, ...changes })).toThrow();
  });
});

describe('integration database safeguards', () => {
  it('requires a separately configured URL, never DATABASE_URL as fallback', () => {
    expect(() =>
      testDatabaseUrl({ DATABASE_URL: valid.DATABASE_URL }),
    ).toThrow();
  });
  it.each([
    'postgresql://localhost/goticket',
    'postgresql://localhost/goticket_shadow',
    'postgresql://remote.example/goticket_test',
    'postgresql://localhost/goticket_test?host=remote.example',
    'postgresql://localhost/goticket_test?schema=private',
    'not-a-url',
  ])('rejects unsafe database URL %#', (TEST_DATABASE_URL) => {
    expect(() => testDatabaseUrl({ TEST_DATABASE_URL })).toThrow();
  });
  it('allows only the local goticket_test database', () => {
    expect(testDatabaseUrl({ TEST_DATABASE_URL: valid.DATABASE_URL })).toBe(
      valid.DATABASE_URL,
    );
  });
});
