require('dotenv').config({ path: '.env.local' })
const { execSync } = require('child_process')

console.log('=== Database Setup ===')
console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 60) + '...')
console.log('')

try {
  console.log('Step 1: Generating Prisma Client...')
  execSync('npx prisma generate', { stdio: 'inherit' })
  console.log('✅ Prisma Client generated\n')

  console.log('Step 2: Pushing schema to database...')
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' })
  console.log('✅ Schema pushed to database\n')

  console.log('Step 3: Testing connection...')
  execSync('node test-db.js', { stdio: 'inherit' })

  console.log('\n✅ Database setup complete!')
} catch (error) {
  console.error('\n❌ Database setup failed:', error.message)
  process.exit(1)
}
