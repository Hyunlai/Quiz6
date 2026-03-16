import { CHAT_ASK_SUCCESS, CHAT_CLEAR } from '../constants/chatConstants';

function generateReply(prompt) {
  const normalized = prompt.toLowerCase();

  if (normalized.includes('price') || normalized.includes('cost')) {
    return 'Carpentry pricing depends on wood type, design complexity, and labor. In this platform, check each service card for current pricing and duration.';
  }

  if (normalized.includes('wood') || normalized.includes('material')) {
    return 'Common woodwork materials include plywood, MDF, mahogany, and treated lumber. Ask your seller about durability and maintenance for your project.';
  }

  if (normalized.includes('repair')) {
    return 'For repairs, provide clear photos and dimensions so the seller can estimate tools, replacement parts, and timeline accurately.';
  }

  if (normalized.includes('service') || normalized.includes('book')) {
    return 'Open a service, review the duration and price, then use the checkout flow to place your order with the seller.';
  }

  return 'I can help with carpentry and woodwork topics like services, pricing, materials, installation, and repairs.';
}

export const askChatbot = (prompt) => (dispatch) => {
  const answer = generateReply(prompt);
  dispatch({
    type: CHAT_ASK_SUCCESS,
    payload: {
      question: prompt,
      answer,
      created_at: new Date().toISOString(),
    },
  });
};

export const clearChatbot = () => (dispatch) => {
  dispatch({ type: CHAT_CLEAR });
};
