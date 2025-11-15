require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
})

async function testConnection() {
  console.log('Testing database connection...')
  console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 60) + '...')

  try {
    // Simple query to test connection
    await prisma.$queryRaw`SELECT 1 as result`
    console.log('✅ Database connection successful!')

    // Check if users table exists
    const users = await prisma.user.findMany({ take: 5 })
    console.log(`✅ Found ${users.length} users in database`)
    users.forEach(u => console.log(`  - ${u.email}`))

  } catch (error) {
    console.error('❌ Database connection failed!')
    console.error('Error:', error.message)
    if (error.code) console.error('Error code:', error.code)
    console.error('\nFull error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
