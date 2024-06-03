/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

/**
 * This function checks if the database is in a state where the workaround is needed.
 * 
 * The workaround is needed when the database is not empty and the _prisma_migrations
 * table does not exist.
 */
async function shouldApplyWorkaround() {
  const tables = await prisma.$queryRaw`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`;

  const databaseNotEmpty = tables.length > 0;
  const migrationsTableExists = tables.some(table => table.table_name === '_prisma_migrations');


  return !migrationsTableExists && databaseNotEmpty;
}


async function handleMigrations() {
  try {
    if (await shouldApplyWorkaround()) {
      console.log('Workaround needed! Running: prisma migrate resolve --applied 0_init');
      execSync('npx prisma migrate resolve --applied 0_init', { stdio: 'inherit' });
    }

    console.log('Running: prisma migrate deploy');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error during migration process:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

handleMigrations();
