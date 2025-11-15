require('dotenv').config({ path: '.env.local' })

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GOOGLE_AI_API_KEY}`

  console.log('Fetching available models...\n')

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (data.models) {
      console.log('Available models that support generateContent:\n')
      data.models
        .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
        .forEach(model => {
          console.log(`- ${model.name}`)
        })
    } else {
      console.log('Response:', JSON.stringify(data, null, 2))
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

listModels()
