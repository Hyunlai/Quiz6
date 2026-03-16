import { ORDER_CREATE_FAIL, ORDER_CREATE_SUCCESS, ORDER_HISTORY_SUCCESS } from '../constants/orderConstants';
import api from '../api';

export const createOrderAction = (payload) => async (dispatch) => {
  try {
    const { data } = await api.post('/api/v1/orders/create/', {
      service_id: payload.service_id,
      paypal_transaction_id: payload.paypal_transaction_id,
      price_paid: payload.price_paid,
    });
    dispatch({ type: ORDER_CREATE_SUCCESS, payload: data });
    return { success: true, order: data };
  } catch (error) {
    const message = error.response?.data?.detail || 'Failed to create order.';
    dispatch({ type: ORDER_CREATE_FAIL, payload: message });
    return { success: false, message };
  }
};

export const listMyOrders = () => async (dispatch) => {
  try {
    const { data } = await api.get('/api/v1/orders/history/');
    dispatch({ type: ORDER_HISTORY_SUCCESS, payload: data });
  } catch {
    dispatch({ type: ORDER_HISTORY_SUCCESS, payload: [] });
  }
};
