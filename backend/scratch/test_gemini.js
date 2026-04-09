require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testModel() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent("Hello");
    console.log("Success:", result.response.text());
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Details:", error.response);
    }
  }
}

testModel();
