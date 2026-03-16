import { CHAT_ASK_SUCCESS, CHAT_CLEAR } from '../constants/chatConstants';
import api from '../api';

export const askChatbot = (prompt) => async (dispatch) => {
  try {
    const { data } = await api.post('/api/v1/chat/ask/', { prompt });
    dispatch({
      type: CHAT_ASK_SUCCESS,
      payload: {
        question: prompt,
        answer: data.reply || '',
        created_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    const statusCode = error?.response?.status;
    const fallbackAnswer =
      statusCode === 401 || statusCode === 403
        ? 'Please sign in to use the chatbot.'
        : 'I can help with carpentry and woodwork topics like services, pricing, materials, installation, and repairs.';

    dispatch({
      type: CHAT_ASK_SUCCESS,
      payload: {
        question: prompt,
        answer: fallbackAnswer,
        created_at: new Date().toISOString(),
      },
    });
  }
};

export const clearChatbot = () => (dispatch) => {
  dispatch({ type: CHAT_CLEAR });
};
