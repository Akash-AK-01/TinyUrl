import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function checkConnection() {
  console.log('🔍 Checking database connection...\n');
  
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in .env file');
    console.log('\n📝 Steps to fix:');
    console.log('1. Create a .env file in the backend directory');
    console.log('2. Add: DATABASE_URL="your_connection_string"');
    console.log('3. See DATABASE-SETUP-GUIDE.md for detailed instructions');
    process.exit(1);
  }

  console.log('✅ DATABASE_URL is set');
  
  // Hide password in output
  const dbUrl = process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':****@');
  console.log(`📍 Database URL: ${dbUrl}\n`);

  try {
    // Test connection
    console.log('🔌 Attempting to connect...');
    await prisma.$connect();
    console.log('✅ Successfully connected to database');

    // Test query
    console.log('🔍 Testing database query...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database query successful');

    // Check if tables exist
    console.log('🔍 Checking if tables exist...');
    try {
      const linkCount = await prisma.link.count();
      console.log(`✅ Tables exist! Found ${linkCount} links in database`);
    } catch (error) {
      if (error.code === 'P2021') {
        console.log('⚠️  Tables do not exist yet');
        console.log('\n📝 Run migrations to create tables:');
        console.log('   npm run prisma:generate');
        console.log('   npm run prisma:migrate');
      } else {
        throw error;
      }
    }

    console.log('\n✅ Database connection is working correctly!');
    console.log('🚀 You can now start the server with: npm run dev');
    
  } catch (error) {
    console.error('\n❌ Database connection failed!');
    console.error('\nError details:');
    console.error(`  Code: ${error.code || 'N/A'}`);
    console.error(`  Message: ${error.message}`);
    
    console.log('\n📝 Common solutions:');
    
    if (error.code === 'P1001') {
      console.log('\n1. Database server is not running or not reachable');
      console.log('   - For cloud databases: Check if the database is active');
      console.log('   - For local PostgreSQL: Start the PostgreSQL service');
      console.log('   - For Docker: Run "docker-compose up -d" in backend directory');
      
      console.log('\n2. Check your DATABASE_URL in .env file');
      console.log('   - Verify host, port, username, and password are correct');
      console.log('   - For cloud databases, ensure "?sslmode=require" is at the end');
      
      console.log('\n3. Check firewall/network settings');
      console.log('   - Ensure port 5432 is not blocked');
      console.log('   - For cloud databases, check if your IP is whitelisted');
    } else if (error.code === 'P1002') {
      console.log('\n- Database server is running but connection timed out');
      console.log('- Check your network connection');
      console.log('- Verify the host and port in DATABASE_URL');
    } else if (error.code === 'P1003') {
      console.log('\n- Database does not exist');
      console.log('- Create the database first');
      console.log('- For local PostgreSQL: CREATE DATABASE tinylink;');
    } else if (error.code === 'P1011') {
      console.log('\n- Authentication failed');
      console.log('- Check username and password in DATABASE_URL');
      console.log('- Ensure special characters in password are URL-encoded');
    }
    
    console.log('\n📖 For detailed setup instructions, see:');
    console.log('   backend/DATABASE-SETUP-GUIDE.md');
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkConnection();
