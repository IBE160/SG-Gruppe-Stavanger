require('dotenv').config({ path: '.env.local' })

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY
const GEMINI_MODEL = "gemini-pro"
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

console.log('API Key exists:', !!GOOGLE_AI_API_KEY)
console.log('API Key length:', GOOGLE_AI_API_KEY?.length)
console.log('API Key preview:', GOOGLE_AI_API_KEY?.substring(0, 10) + '...')
console.log('API URL:', GEMINI_API_URL)

async function testGemini() {
  const url = `${GEMINI_API_URL}?key=${GOOGLE_AI_API_KEY}`

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: "Say hello in JSON format: {\"message\": \"your message\"}",
          },
        ],
      },
    ],
  }

  console.log('\nCalling Gemini API...')

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    console.log('Response status:', response.status)
    console.log('Response statusText:', response.statusText)

    const text = await response.text()
    console.log('Response body:', text)

    if (!response.ok) {
      console.error('❌ API call failed!')
      return
    }

    const data = JSON.parse(text)
    console.log('✅ API call successful!')
    console.log('Generated text:', data.candidates[0]?.content?.parts[0]?.text)
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('Full error:', error)
  }
}

testGemini()
