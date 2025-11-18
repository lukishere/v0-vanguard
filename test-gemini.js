const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  const genAI = new GoogleGenerativeAI('AIzaSyDLCS950zSGSzzgvyO4VKBHPvmq6YWe5sk');
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

