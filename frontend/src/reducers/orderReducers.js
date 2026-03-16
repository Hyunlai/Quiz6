import { ORDER_CREATE_FAIL, ORDER_CREATE_SUCCESS, ORDER_HISTORY_SUCCESS } from '../constants/orderConstants';

export const orderReducer = (state = { myOrders: [] }, action) => {
  switch (action.type) {
    case ORDER_HISTORY_SUCCESS:
      return { ...state, myOrders: action.payload || [] };
    case ORDER_CREATE_SUCCESS:
      return { ...state, lastOrder: action.payload, error: null };
    case ORDER_CREATE_FAIL:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
