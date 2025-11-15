require('dotenv').config({ path: '.env.local' })
const { Client } = require('pg')

async function testConnection() {
  console.log('=== Testing PostgreSQL Connection ===\n')

  const connectionString = process.env.DATABASE_URL
  console.log('Connection string:', connectionString?.substring(0, 70) + '...\n')

  // Extract password from connection string for debugging
  const passwordMatch = connectionString?.match(/:([^@]+)@/)
  const password = passwordMatch ? passwordMatch[1] : 'NOT FOUND'
  console.log('Extracted password:', password)
  console.log('Password length:', password.length)
  console.log('')

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  })

  try {
    console.log('Attempting to connect...')
    await client.connect()
    console.log('✅ Connection successful!')

    const result = await client.query('SELECT NOW()')
    console.log('✅ Query successful! Server time:', result.rows[0].now)

  } catch (error) {
    console.error('❌ Connection failed!')
    console.error('Error message:', error.message)
    console.error('Error code:', error.code)
    console.error('\nThis usually means:')
    console.error('  1. Wrong password in Supabase')
    console.error('  2. Supabase project is paused/deleted')
    console.error('  3. Network/firewall issue')
    console.error('\nPlease check your Supabase dashboard:')
    console.error('  - Project Settings → Database')
    console.error('  - Reset database password if needed')
  } finally {
    await client.end()
  }
}

testConnection()
