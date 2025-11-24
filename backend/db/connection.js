import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

// Create a single Prisma Client instance
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

/**
 * Initialize database connection
 * Verifies connection and runs migrations if needed
 */
export async function initializeDatabase() {
  try {
    // Test the connection
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL database');
    
    // Verify we can query the database
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection verified');
    
    return prisma;
  } catch (error) {
    // Log richer error details for easier debugging (Prisma P1012 etc.)
    console.error('❌ Error connecting to PostgreSQL:');
    try {
      // Print full error object (including non-enumerable properties)
      const util = await import('util');
      console.error(util.inspect(error, { showHidden: true, depth: null }));
    } catch (e) {
      console.error(error);
    }

    // If Prisma provides meta information, print it formatted
    if (error && error.meta) {
      try {
        console.error('Prisma error meta:');
        console.error(JSON.stringify(error.meta, null, 2));
      } catch (e) {
        // ignore
      }
    }
    throw error;
  }
}

/**
 * Get Prisma client instance
 */
export function getPrismaClient() {
  return prisma;
}

export default prisma;
