// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkUser() {
  console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...')

  const email = 'thomas.ekrem.jensen@gmail.com'

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (user) {
    console.log('✅ User exists!')
    console.log('Email:', user.email)
    console.log('Name:', user.name)
    console.log('ID:', user.id)
    console.log('Created:', user.createdAt)
  } else {
    console.log('❌ User NOT found in database')
  }

  // Vis alle brukere
  const allUsers = await prisma.user.findMany({
    select: { email: true, name: true }
  })

  console.log('\nAll users in database:')
  allUsers.forEach(u => console.log('-', u.email, '|', u.name))
}

checkUser()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
