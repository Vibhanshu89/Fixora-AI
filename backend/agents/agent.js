const { GoogleGenerativeAI } = require('@google/generative-ai');
const { defineServiceTool, executeDefineService } = require('./tools/defineServiceTool');
const { findWorkerTool, executeFindWorker } = require('./tools/findWorkerTool');
const { createBookingTool, executeCreateBooking } = require('./tools/createBookingTool');
const { getBookingStatusTool, executeGetBookingStatus } = require('./tools/getBookingStatusTool');
const ChatSession = require('../models/ChatSession');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are Fixora AI, an intelligent and friendly home service assistant for India.
You help users book home repair and maintenance services by understanding their needs and automatically finding the right technician.

You understand Hinglish (Hindi + English mixed), but you always RESPOND in clear, friendly English.

You support major Indian cities including:
- North: Delhi, Noida, Gurgaon, Chandigarh, Jaipur
- West: Mumbai, Pune, Ahmedabad
- South: Bangalore, Hyderabad, Chennai
- East: Kolkata, Lucknow

Service categories you can help with:
- Home Basics: Electrical, Plumbing, Carpentry, Painting
- Appliances: AC Repair, Appliance Repair, RO Service
- Lifestyle: Cleaning, Pest Control, Salon at Home, Gardening
- Security: CCTV Installation

You have access to these tools:
- defineService: Identifies what service the user needs from their message
- findWorker: Finds available verified technicians by category and city
- createBooking: Confirms and creates a booking in the system
- getBookingStatus: Checks the status of an existing booking

BOOKING FLOW:
1. When user describes a problem → call defineService to identify the category
2. Ask for their city if not mentioned
3. Call findWorker to find technicians
4. Present the top 1-2 workers clearly (name, rating, price/hr, experience)
5. Ask user to confirm which worker and preferred time
6. Once confirmed → call createBooking
7. Share the booking confirmation with reference number

RULES:
- Always be warm, empathetic, and concise
- NEVER book without user confirmation
- If no workers available for a city, say so and suggest alternatives (like check different nearby city)
- Format lists and worker details in a clean readable way
- Use emojis sparingly but effectively (✅ 🔧 📅 ⭐)
- If user says "yes", "book it", "confirm", "haan", "kar do" — treat it as confirmation
`;

const toolDeclarations = [
  defineServiceTool,
  findWorkerTool,
  createBookingTool,
  getBookingStatusTool,
];

const toolExecutors = {
  defineService: executeDefineService,
  findWorker: executeFindWorker,
  createBooking: executeCreateBooking,
  getBookingStatus: executeGetBookingStatus,
};

async function runAgent({ userMessage, userId, sessionId, userCity, pendingContext, socket }) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-3-flash-preview',
    systemInstruction: SYSTEM_PROMPT,
    tools: [{ functionDeclarations: toolDeclarations }],
  });

  // Load existing session history
  let session = await ChatSession.findOne({ sessionId });
  if (!session) {
    session = await ChatSession.create({ userId, sessionId, messages: [], agentSteps: [] });
  }

  // Build history for Gemini
  const history = session.messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  const chat = model.startChat({ history });

  // Enrich message with context
  let enrichedMessage = userMessage;
  if (userCity) enrichedMessage += ` [User's city: ${userCity}]`;
  if (pendingContext) enrichedMessage += ` [Context: ${JSON.stringify(pendingContext)}]`;

  // Save user message
  session.messages.push({ role: 'user', content: userMessage });

  if (socket) socket.emit('agent:thinking', { step: 'Analyzing your request...' });

  let response = await chat.sendMessage(enrichedMessage);
  let result = response.response;

  // Agentic Loop — keep calling tools until model gives final text response
  let maxIterations = 6;
  let iteration = 0;

  while (result.functionCalls() && result.functionCalls().length > 0 && iteration < maxIterations) {
    iteration++;
    const functionCall = result.functionCalls()[0];
    const toolName = functionCall.name;
    const toolArgs = functionCall.args;

    if (socket) {
      socket.emit('agent:tool_call', {
        step: `Calling tool: ${toolName}`,
        tool: toolName,
        args: toolArgs,
      });
    }

    // Log agent step
    session.agentSteps.push({ step: `tool_call_${iteration}`, tool: toolName, input: toolArgs });

    let toolResult;
    try {
      // Inject userId for createBooking
      if (toolName === 'createBooking') toolArgs.userId = userId;
      if (toolName === 'createBooking') toolArgs.sessionId = sessionId;
      toolResult = await toolExecutors[toolName](toolArgs);
    } catch (err) {
      toolResult = { error: err.message };
    }

    // Update session with tool result
    session.agentSteps[session.agentSteps.length - 1].output = toolResult;

    if (socket) {
      socket.emit('agent:tool_result', {
        tool: toolName,
        result: toolResult,
        step: `${toolName} completed`,
      });
    }

    // Send tool result back to model
    response = await chat.sendMessage([
      {
        functionResponse: {
          name: toolName,
          response: toolResult,
        },
      },
    ]);
    result = response.response;
  }

  const finalText = result.text();

  // Save assistant message
  session.messages.push({ role: 'assistant', content: finalText });
  await session.save();

  if (socket) socket.emit('agent:done', { message: finalText });

  return {
    message: finalText,
    sessionId,
    agentSteps: session.agentSteps.slice(-iteration),
  };
}

module.exports = { runAgent };
