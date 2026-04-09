const Worker = require('../../models/Worker');

const defineServiceTool = {
  name: 'defineService',
  description:
    'Analyzes the user message to identify the home service category, specific problem, and urgency level.',
  parameters: {
    type: 'object',
    properties: {
      userMessage: {
        type: 'string',
        description: 'The original user message describing their problem',
      },
    },
    required: ['userMessage'],
  },
};

async function executeDefineService({ userMessage }) {
  const categoryMap = {
    electrical: ['fan', 'wiring', 'switch', 'socket', 'light', 'electric', 'power', 'fuse', 'mcb', 'inverter'],
    plumbing: ['pipe', 'leak', 'tap', 'faucet', 'drain', 'toilet', 'bathroom', 'water', 'sink', 'sewage'],
    'ac-repair': ['ac', 'air conditioner', 'cooling', 'air condition', 'split ac', 'window ac'],
    carpentry: ['furniture', 'door', 'window', 'wood', 'cabinet', 'almirah', 'chair', 'table', 'carpenter'],
    cleaning: ['clean', 'deep clean', 'sweep', 'mop', 'sofa', 'carpet', 'bathroom clean'],
    painting: ['paint', 'wall', 'color', 'polish', 'coat', 'distemper'],
    'appliance-repair': ['washing machine', 'fridge', 'refrigerator', 'microwave', 'geyser', 'heater', 'mixer', 'grinder', 'oven'],
    'pest-control': ['pest', 'cockroach', 'rat', 'termite', 'mosquito', 'ant', 'bug', 'insect'],
  };

  const msg = userMessage.toLowerCase();
  let detectedCategory = 'electrical';
  let detectedService = 'General Repair';

  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (keywords.some((kw) => msg.includes(kw))) {
      detectedCategory = category;
      detectedService = keywords.find((kw) => msg.includes(kw));
      detectedService = detectedService.charAt(0).toUpperCase() + detectedService.slice(1) + ' Repair';
      break;
    }
  }

  const urgencyKeywords = ['urgent', 'emergency', 'immediately', 'asap', 'now', 'broken', 'not working'];
  const isUrgent = urgencyKeywords.some((kw) => msg.includes(kw));

  return {
    category: detectedCategory,
    service: detectedService,
    urgency: isUrgent ? 'high' : 'normal',
    userMessage,
  };
}

module.exports = { defineServiceTool, executeDefineService };
