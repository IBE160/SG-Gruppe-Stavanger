#!/usr/bin/env node
/**
 * Supabase Setup Helper
 * This script helps you configure your Supabase database connection strings
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n=== ibe160 Supabase Setup Helper ===\n');
console.log('Follow these steps:');
console.log('1. Go to https://supabase.com/dashboard');
console.log('2. Click "New Project"');
console.log('3. Choose a name (e.g., "ibe160-food-tracker")');
console.log('4. Set a strong database password (SAVE THIS!)');
console.log('5. Select region closest to you (e.g., "Europe (Frankfurt)")');
console.log('6. Wait 1-2 minutes for project to provision');
console.log('7. Go to: Settings → Database → Connection String');
console.log('8. Select "URI" format');
console.log('9. Copy the full connection string\n');

rl.question('Paste your Supabase connection string here: ', (connectionString) => {
  try {
    // Validate the connection string
    if (!connectionString || !connectionString.includes('supabase.co')) {
      console.error('\n❌ Error: This doesn\'t look like a valid Supabase connection string');
      console.log('Expected format: postgresql://postgres.[ref]:[password]@...supabase.com:5432/postgres');
      process.exit(1);
    }

    // Parse the connection string to create both URLs
    let databaseUrl = connectionString.trim();
    let directUrl = connectionString.trim();

    // DATABASE_URL should use port 6543 with pgbouncer
    databaseUrl = databaseUrl.replace(':5432/', ':6543/');
    if (!databaseUrl.includes('?pgbouncer=true')) {
      databaseUrl += databaseUrl.includes('?') ? '&pgbouncer=true' : '?pgbouncer=true';
    }

    // DIRECT_URL should use port 5432 without pgbouncer
    directUrl = directUrl.replace(':6543/', ':5432/');
    directUrl = directUrl.replace(/[?&]pgbouncer=true/, '');

    // Read current .env.local
    const envPath = path.join(__dirname, '.env.local');
    let envContent = fs.readFileSync(envPath, 'utf8');

    // Replace DATABASE_URL
    envContent = envContent.replace(
      /DATABASE_URL="[^"]*"/,
      `DATABASE_URL="${databaseUrl}"`
    );

    // Replace DIRECT_URL
    envContent = envContent.replace(
      /DIRECT_URL="[^"]*"/,
      `DIRECT_URL="${directUrl}"`
    );

    // Write back to .env.local
    fs.writeFileSync(envPath, envContent, 'utf8');

    console.log('\n✅ Success! Your .env.local has been updated with:');
    console.log(`\nDATABASE_URL: ${databaseUrl.substring(0, 50)}...`);
    console.log(`DIRECT_URL: ${directUrl.substring(0, 50)}...`);

    console.log('\n📋 Next steps:');
    console.log('1. Run: npx prisma db push');
    console.log('2. Run: npm run dev');
    console.log('3. Open: http://localhost:3000');
    console.log('\n🎉 Your database is ready!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
});
