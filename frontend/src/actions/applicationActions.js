import {
  APPLICATION_ACTION_FAIL,
  APPLICATION_ACTION_SUCCESS,
  APPLICATION_LIST_SUCCESS,
} from '../constants/applicationConstants';
import api from '../api';

export const listApplications = () => async (dispatch) => {
  try {
    const { data } = await api.get('/api/v1/applications/list/');
    dispatch({ type: APPLICATION_LIST_SUCCESS, payload: data });
  } catch {
    dispatch({ type: APPLICATION_LIST_SUCCESS, payload: [] });
  }
};

export const submitSellerApplication = () => async (dispatch) => {
  try {
    await api.post('/api/v1/applications/apply/');
    dispatch({ type: APPLICATION_ACTION_SUCCESS, payload: 'Application submitted.' });
    const { data } = await api.get('/api/v1/applications/list/');
    dispatch({ type: APPLICATION_LIST_SUCCESS, payload: data });
    return { success: true, message: 'Your seller application has been submitted.' };
  } catch (error) {
    const message = error.response?.data?.detail || 'Failed to submit application.';
    dispatch({ type: APPLICATION_ACTION_FAIL, payload: message });
    return { success: false, message };
  }
};

export const approveApplication = (applicationId, merchantId) => async (dispatch) => {
  try {
    await api.post(`/api/v1/applications/${applicationId}/approve/`, { merchant_id: merchantId });
    dispatch({ type: APPLICATION_ACTION_SUCCESS, payload: 'Application approved.' });
    const { data } = await api.get('/api/v1/applications/list/');
    dispatch({ type: APPLICATION_LIST_SUCCESS, payload: data });
    return { success: true };
  } catch (error) {
    const message = error.response?.data?.detail || 'Failed to approve application.';
    dispatch({ type: APPLICATION_ACTION_FAIL, payload: message });
    return { success: false, message };
  }
};

export const declineApplication = (applicationId, reason) => async (dispatch) => {
  try {
    await api.post(`/api/v1/applications/${applicationId}/decline/`, { decline_reason: reason });
    dispatch({ type: APPLICATION_ACTION_SUCCESS, payload: 'Application declined.' });
    const { data } = await api.get('/api/v1/applications/list/');
    dispatch({ type: APPLICATION_LIST_SUCCESS, payload: data });
    return { success: true };
  } catch (error) {
    const message = error.response?.data?.detail || 'Failed to decline application.';
    dispatch({ type: APPLICATION_ACTION_FAIL, payload: message });
    return { success: false, message };
  }
};
