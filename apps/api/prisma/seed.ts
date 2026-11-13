import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { seedUsers, validateSeedEnvironment } from './seed-users';

async function main(): Promise<void> {
  // Validar antes de crear el cliente o abrir conexiones.
  const { connectionString, password } = validateSeedEnvironment(process.env);
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });
  try {
    await seedUsers(prisma, password);
    console.log('Seeder de usuarios finalizado');
  } finally {
    await prisma.$disconnect();
  }
}

void main().catch(() => {
  // No imprimir errores de conexión que puedan contener credenciales.
  console.error(
    'Seeder rechazado o fallido. Revisá las variables y la conexión local.',
  );
  process.exitCode = 1;
});
