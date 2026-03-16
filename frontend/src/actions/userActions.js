import {
  USER_LIST_SUCCESS,
  USER_LOAD_SESSION,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
} from '../constants/userConstants';
import api from '../api';
import { clearSession, getCurrentUser, storeSession } from '../authService';

export const loadSession = () => (dispatch) => {
  dispatch({ type: USER_LOAD_SESSION, payload: getCurrentUser() });
};

export const login = (email, password) => async (dispatch) => {
  dispatch({ type: USER_LOGIN_REQUEST });
  try {
    const { data } = await api.post('/api/v1/users/login/', { email, password });
    storeSession(data.user, data.access, data.refresh);
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data.user });
    return { success: true, user: data.user };
  } catch (error) {
    const message = error.response?.data?.detail || 'Invalid email or password.';
    dispatch({ type: USER_LOGIN_FAIL, payload: message });
    return { success: false, message };
  }
};

export const logout = () => (dispatch) => {
  clearSession();
  dispatch({ type: USER_LOGOUT });
};

export const register = (formData) => async (dispatch) => {
  dispatch({ type: USER_REGISTER_REQUEST });
  try {
    const payload = {
      email: formData.email,
      username: formData.username,
      phone_number: formData.phone_number,
      first_name: formData.first_name,
      last_name: formData.last_name,
      location: formData.location,
      gender: formData.gender,
      password: formData.password,
    };

    await api.post('/api/v1/users/register/', payload);
    dispatch({ type: USER_REGISTER_SUCCESS, payload: 'Registration successful.' });
    return { success: true, message: 'Registration successful. Your account was created as User.' };
  } catch (error) {
    const data = error.response?.data || {};
    const message = Object.values(data).flat().join(' ') || data.detail || 'Registration failed.';
    dispatch({ type: USER_REGISTER_FAIL, payload: message });
    return { success: false, message };
  }
};

export const listUsers = () => async (dispatch) => {
  try {
    const { data } = await api.get('/api/v1/users/admin/users/');
    dispatch({ type: USER_LIST_SUCCESS, payload: data });
  } catch {
    dispatch({ type: USER_LIST_SUCCESS, payload: [] });
  }
};

export const editUserByAdmin = (userId, updates) => async (dispatch) => {
  try {
    await api.patch(`/api/v1/users/admin/users/${userId}/`, updates);
    const { data } = await api.get('/api/v1/users/admin/users/');
    dispatch({ type: USER_LIST_SUCCESS, payload: data });
    return { success: true };
  } catch (error) {
    const message = error.response?.data?.detail || 'Update failed.';
    return { success: false, message };
  }
};

export const removeUserByAdmin = (userId) => async (dispatch) => {
  try {
    await api.delete(`/api/v1/users/admin/users/${userId}/`);
    const { data } = await api.get('/api/v1/users/admin/users/');
    dispatch({ type: USER_LIST_SUCCESS, payload: data });
  } catch {
    dispatch({ type: USER_LIST_SUCCESS, payload: [] });
  }
};
