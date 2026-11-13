import { randomBytes, randomUUID } from 'node:crypto';
import { compare, getRounds, hash } from 'bcrypt';
import { PrismaService } from '../src/prisma/prisma.service';
import { UsersService } from '../src/users/users.service';
import {
  seedEmails,
  seedUsers,
  validateSeedEnvironment,
} from '../prisma/seed-users';
import { loadTestEnvironment } from './test-database';

const connectionString = loadTestEnvironment();
const password = randomBytes(24).toString('hex');
const ownedIds: string[] = [];
let prisma: PrismaService;
let users: UsersService;
let verifiedDatabase = false;

describe('Users persistence (real PostgreSQL)', () => {
  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.onModuleInit();
    const databases = await prisma.$queryRaw<
      Array<{ name: string }>
    >`SELECT current_database() AS name`;
    if (databases[0]?.name !== 'goticket_test') {
      throw new Error('Integration refused: server is not goticket_test');
    }
    verifiedDatabase = true;
    users = new UsersService(prisma);
  });

  afterAll(async () => {
    try {
      if (verifiedDatabase && ownedIds.length) {
        await prisma.user.deleteMany({ where: { id: { in: ownedIds } } });
      }
    } finally {
      if (prisma) await prisma.onModuleDestroy();
    }
  });

  it('creates, retrieves and persists only a bcrypt hash', async () => {
    const passwordHash = await hash(password, 12);
    const created = await prisma.user.create({
      data: { email: `${randomUUID()}@example.com`, passwordHash },
    });
    ownedIds.push(created.id);
    const recovered = await prisma.user.findUniqueOrThrow({
      where: { id: created.id },
    });
    expect(recovered).toEqual(created);
    expect(recovered.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(recovered.createdAt).toBeInstanceOf(Date);
    expect(recovered.updatedAt).toBeInstanceOf(Date);
    expect(recovered.passwordHash).not.toBe(password);
    expect(getRounds(recovered.passwordHash)).toBe(12);
    expect(await compare(password, recovered.passwordHash)).toBe(true);
    expect(
      await compare(randomBytes(24).toString('hex'), recovered.passwordHash),
    ).toBe(false);
  });

  it('reads through UsersService without passwordHash in actual query results', async () => {
    const created = await prisma.user.create({
      data: {
        email: `${randomUUID()}@example.com`,
        passwordHash: await hash(password, 12),
      },
    });
    ownedIds.push(created.id);
    const result = await users.findAll();
    expect(result).toContainEqual({
      id: created.id,
      email: created.email,
      createdAt: created.createdAt,
    });
    expect(result.every((user) => !('passwordHash' in user))).toBe(true);
    expect(JSON.stringify(result)).not.toContain(created.passwordHash);
  });

  it('enforces UNIQUE email in PostgreSQL, including concurrent attempts', async () => {
    const email = `${randomUUID()}@example.com`;
    const passwordHash = await hash(password, 12);
    const attempts = await Promise.allSettled([
      prisma.user.create({ data: { email, passwordHash } }),
      prisma.user.create({ data: { email, passwordHash } }),
    ]);
    for (const attempt of attempts) {
      if (attempt.status === 'fulfilled') ownedIds.push(attempt.value.id);
    }
    expect(
      attempts.filter((attempt) => attempt.status === 'fulfilled'),
    ).toHaveLength(1);
    const failure = attempts.find((attempt) => attempt.status === 'rejected');
    expect(failure).toMatchObject({
      status: 'rejected',
      reason: { code: 'P2002' },
    });
    expect(await prisma.user.count({ where: { email } })).toBe(1);
  });

  it('seeds five users idempotently without changing existing hashes or timestamps', async () => {
    const existing = await prisma.user.count({
      where: { email: { in: [...seedEmails] } },
    });
    if (existing !== 0) {
      throw new Error(
        'Seed fixtures already exist in goticket_test; use the isolated local runner. No existing rows were modified.',
      );
    }
    const config = validateSeedEnvironment({
      NODE_ENV: 'test',
      ALLOW_USER_SEED: 'true',
      DATABASE_URL: connectionString,
      SEED_USER_PASSWORD: password,
    });
    await seedUsers(prisma, config.password);
    const first = await prisma.user.findMany({
      where: { email: { in: [...seedEmails] } },
      orderBy: { email: 'asc' },
    });
    ownedIds.push(...first.map((user) => user.id));
    await seedUsers(prisma, randomBytes(24).toString('hex'));
    const second = await prisma.user.findMany({
      where: { email: { in: [...seedEmails] } },
      orderBy: { email: 'asc' },
    });
    expect(first).toHaveLength(5);
    expect(second).toEqual(first);
    for (const user of second) {
      expect(user.passwordHash).not.toBe(password);
      expect(getRounds(user.passwordHash)).toBe(12);
      expect(await compare(password, user.passwordHash)).toBe(true);
    }
  });
});
