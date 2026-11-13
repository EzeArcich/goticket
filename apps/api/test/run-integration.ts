import { spawnSync } from 'node:child_process';
import { loadTestEnvironment } from './test-database';

function main(): void {
  loadTestEnvironment();
  for (const args of [
    ['exec', 'prisma', 'generate'],
    ['exec', 'prisma', 'migrate', 'deploy'],
    ['exec', 'prisma', 'migrate', 'status'],
    [
      'exec',
      'jest',
      '--config',
      'test/jest-integration.json',
      '--runInBand',
      '--json',
      '--outputFile',
      '/tmp/goticket-integration-results.json',
    ],
  ]) {
    const env = args.includes('jest')
      ? {
          ...process.env,
          NODE_OPTIONS: `${process.env.NODE_OPTIONS ?? ''} --experimental-vm-modules`,
        }
      : process.env;
    const result = spawnSync('pnpm', args, { stdio: 'inherit', env });
    if (result.error || result.status !== 0) {
      process.exitCode = result.status || 1;
      return;
    }
  }
}
try {
  main();
} catch {
  console.error(
    'Integración rechazada: configurá TEST_DATABASE_URL para PostgreSQL local goticket_test.',
  );
  process.exitCode = 1;
}
