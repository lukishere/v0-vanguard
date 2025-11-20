const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('Error: GEMINI_API_KEY not found in environment variables');
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: 'Explain how AI works in a few words' }] }],
    });

    const response = await result.response;
    const text = response.text();
    console.log('Success! Response:', text);
  } catch (error) {
    console.error('Error:', error);
  }
}

testGemini();
