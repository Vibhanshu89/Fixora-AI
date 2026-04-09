require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // There isn't a direct listModels in the SDK for easy use without more boilerplate usually
    // but we can try common ones
    const models = ['gemini-pro', 'gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.0-pro'];
    for (const m of models) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        await model.generateContent("ping");
        console.log(`Model ${m} is available!`);
      } catch (e) {
        console.log(`Model ${m} failed: ${e.message}`);
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

listModels();
