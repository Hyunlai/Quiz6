import {
  APPLICATION_ACTION_FAIL,
  APPLICATION_ACTION_SUCCESS,
  APPLICATION_LIST_SUCCESS,
} from '../constants/applicationConstants';
import {
  applyForSeller,
  approveSellerApplication,
  getSellerApplications,
  rejectSellerApplication,
} from '../authService';

export const listApplications = () => (dispatch) => {
  dispatch({ type: APPLICATION_LIST_SUCCESS, payload: getSellerApplications() });
};

export const submitSellerApplication = (userId) => (dispatch) => {
  const response = applyForSeller(userId);

  if (!response.success) {
    dispatch({ type: APPLICATION_ACTION_FAIL, payload: response.message });
    return response;
  }

  dispatch({ type: APPLICATION_ACTION_SUCCESS, payload: response.message });
  dispatch({ type: APPLICATION_LIST_SUCCESS, payload: getSellerApplications() });
  return response;
};

export const approveApplication = (applicationId, merchantId) => (dispatch) => {
  const response = approveSellerApplication(applicationId, merchantId);

  if (!response.success) {
    dispatch({ type: APPLICATION_ACTION_FAIL, payload: response.message });
    return response;
  }

  dispatch({ type: APPLICATION_ACTION_SUCCESS, payload: 'Application approved.' });
  dispatch({ type: APPLICATION_LIST_SUCCESS, payload: getSellerApplications() });
  return response;
};

export const declineApplication = (applicationId, reason) => (dispatch) => {
  const response = rejectSellerApplication(applicationId, reason);

  if (!response.success) {
    dispatch({ type: APPLICATION_ACTION_FAIL, payload: response.message });
    return response;
  }

  dispatch({ type: APPLICATION_ACTION_SUCCESS, payload: 'Application declined.' });
  dispatch({ type: APPLICATION_LIST_SUCCESS, payload: getSellerApplications() });
  return response;
};
