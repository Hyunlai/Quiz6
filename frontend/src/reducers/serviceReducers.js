import {
  SERVICE_CREATE_SUCCESS,
  SERVICE_DELETE_SUCCESS,
  SERVICE_LIST_FAIL,
  SERVICE_LIST_REQUEST,
  SERVICE_LIST_SUCCESS,
  SERVICE_UPDATE_SUCCESS,
  SELLER_SERVICE_LIST_SUCCESS,
} from '../constants/serviceConstants';

export const serviceListReducer = (state = { services: [] }, action) => {
  switch (action.type) {
    case SERVICE_LIST_REQUEST:
      return { ...state, loading: true };
    case SERVICE_LIST_SUCCESS:
      return { loading: false, services: action.payload || [] };
    case SERVICE_LIST_FAIL:
      return { loading: false, services: [], error: action.payload };
    default:
      return state;
  }
};

export const sellerServiceReducer = (state = { sellerServices: [] }, action) => {
  switch (action.type) {
    case SELLER_SERVICE_LIST_SUCCESS:
      return { ...state, sellerServices: action.payload || [] };
    case SERVICE_CREATE_SUCCESS:
    case SERVICE_UPDATE_SUCCESS:
    case SERVICE_DELETE_SUCCESS:
      return { ...state, actionResult: action.payload };
    default:
      return state;
  }
};
