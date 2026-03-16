import {
  SERVICE_CREATE_SUCCESS,
  SERVICE_DELETE_SUCCESS,
  SERVICE_LIST_FAIL,
  SERVICE_LIST_REQUEST,
  SERVICE_LIST_SUCCESS,
  SERVICE_UPDATE_SUCCESS,
  SELLER_SERVICE_LIST_SUCCESS,
} from '../constants/serviceConstants';
import api from '../api';

export const listServices = () => async (dispatch) => {
  dispatch({ type: SERVICE_LIST_REQUEST });
  try {
    const { data } = await api.get('/api/v1/services/list/');
    dispatch({ type: SERVICE_LIST_SUCCESS, payload: data });
  } catch {
    dispatch({ type: SERVICE_LIST_FAIL, payload: 'Unable to load services.' });
  }
};

export const listMySellerServices = () => async (dispatch) => {
  try {
    const { data } = await api.get('/api/v1/services/manage/');
    dispatch({ type: SELLER_SERVICE_LIST_SUCCESS, payload: data });
  } catch {
    dispatch({ type: SELLER_SERVICE_LIST_SUCCESS, payload: [] });
  }
};

export const addService = (payload) => async (dispatch) => {
  try {
    const { data } = await api.post('/api/v1/services/manage/', payload);
    dispatch({ type: SERVICE_CREATE_SUCCESS, payload: data });
    dispatch(listServices());
    return { success: true, service: data };
  } catch (error) {
    const message = error.response?.data?.detail || 'Failed to create service.';
    return { success: false, message };
  }
};

export const editService = (serviceId, payload) => async (dispatch) => {
  try {
    const { data } = await api.patch(`/api/v1/services/manage/${serviceId}/`, payload);
    dispatch({ type: SERVICE_UPDATE_SUCCESS, payload: data });
    dispatch(listServices());
    return { success: true };
  } catch (error) {
    const message = error.response?.data?.detail || 'Failed to update service.';
    return { success: false, message };
  }
};

export const deleteService = (serviceId) => async (dispatch) => {
  try {
    await api.delete(`/api/v1/services/manage/${serviceId}/`);
    dispatch({ type: SERVICE_DELETE_SUCCESS, payload: serviceId });
    dispatch(listServices());
    return { success: true };
  } catch (error) {
    const message = error.response?.data?.detail || 'Failed to delete service.';
    return { success: false, message };
  }
};
