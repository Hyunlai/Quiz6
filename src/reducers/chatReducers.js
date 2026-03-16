import { CHAT_ASK_SUCCESS, CHAT_CLEAR } from '../constants/chatConstants';

export const chatReducer = (state = { messages: [] }, action) => {
  switch (action.type) {
    case CHAT_ASK_SUCCESS:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case CHAT_CLEAR:
      return { ...state, messages: [] };
    default:
      return state;
  }
};
