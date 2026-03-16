import { ORDER_CREATE_FAIL, ORDER_CREATE_SUCCESS, ORDER_HISTORY_SUCCESS } from '../constants/orderConstants';
import { createOrder, getUserOrders } from '../marketService';

export const createOrderAction = (payload) => (dispatch) => {
  const response = createOrder(payload);

  if (!response.success) {
    dispatch({ type: ORDER_CREATE_FAIL, payload: response.message });
    return response;
  }

  dispatch({ type: ORDER_CREATE_SUCCESS, payload: response.order });
  return response;
};

export const listMyOrders = (userId) => (dispatch) => {
  dispatch({ type: ORDER_HISTORY_SUCCESS, payload: getUserOrders(userId) });
};
