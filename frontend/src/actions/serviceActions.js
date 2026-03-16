import {
  SERVICE_CREATE_SUCCESS,
  SERVICE_DELETE_SUCCESS,
  SERVICE_LIST_FAIL,
  SERVICE_LIST_REQUEST,
  SERVICE_LIST_SUCCESS,
  SERVICE_UPDATE_SUCCESS,
  SELLER_SERVICE_LIST_SUCCESS,
} from '../constants/serviceConstants';
import {
  createService,
  getSellerServices,
  getServices,
  removeService,
  updateService,
} from '../marketService';

export const listServices = () => (dispatch) => {
  dispatch({ type: SERVICE_LIST_REQUEST });

  try {
    dispatch({ type: SERVICE_LIST_SUCCESS, payload: getServices() });
  } catch {
    dispatch({ type: SERVICE_LIST_FAIL, payload: 'Unable to load services.' });
  }
};

export const listMySellerServices = (sellerId) => (dispatch) => {
  dispatch({ type: SELLER_SERVICE_LIST_SUCCESS, payload: getSellerServices(sellerId) });
};

export const addService = (payload) => (dispatch) => {
  const response = createService(payload);
  dispatch({ type: SERVICE_CREATE_SUCCESS, payload: response });
  dispatch({ type: SERVICE_LIST_SUCCESS, payload: getServices() });
  return response;
};

export const editService = (serviceId, payload) => (dispatch) => {
  const response = updateService(serviceId, payload);
  dispatch({ type: SERVICE_UPDATE_SUCCESS, payload: response });
  dispatch({ type: SERVICE_LIST_SUCCESS, payload: getServices() });
  return response;
};

export const deleteService = (serviceId) => (dispatch) => {
  const response = removeService(serviceId);
  dispatch({ type: SERVICE_DELETE_SUCCESS, payload: response });
  dispatch({ type: SERVICE_LIST_SUCCESS, payload: getServices() });
  return response;
};
