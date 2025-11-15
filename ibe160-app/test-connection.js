require('dotenv').config({ path: '.env.local' })
const { Client } = require('pg')

async function testConnection() {
  console.log('=== Testing PostgreSQL Connection ===\n')

  const connectionString = process.env.DATABASE_URL
  console.log('Connection string:', connectionString?.substring(0, 70) + '...\n')

  // Parse connection string components
  const urlMatch = connectionString?.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
  if (urlMatch) {
    console.log('Username:', urlMatch[1])
    console.log('Password:', urlMatch[2])
    console.log('Host:', urlMatch[3])
    console.log('Port:', urlMatch[4])
    console.log('Database:', urlMatch[5])
  } else {
    console.log('❌ Could not parse connection string')
  }
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
