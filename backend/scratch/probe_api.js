require('dotenv').config();
const axios = require('axios');

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const response = await axios.get(url);
    console.log("Available Models:");
    response.data.models.forEach(m => console.log(`- ${m.name}`));
  } catch (error) {
    if (error.response) {
      console.error("Error Status:", error.response.status);
      console.error("Error Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Error:", error.message);
    }
  }
}

listModels();
