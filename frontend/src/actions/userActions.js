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
import {
  deleteUser,
  ensureSeedAdmin,
  getCurrentUser,
  getUsers,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from '../authService';

export const loadSession = () => (dispatch) => {
  ensureSeedAdmin();
  dispatch({ type: USER_LOAD_SESSION, payload: getCurrentUser() });
};

export const login = (email, password) => (dispatch) => {
  dispatch({ type: USER_LOGIN_REQUEST });
  const response = loginUser(email, password);

  if (!response.success) {
    dispatch({ type: USER_LOGIN_FAIL, payload: response.message });
    return response;
  }

  dispatch({ type: USER_LOGIN_SUCCESS, payload: response.user });
  dispatch({ type: USER_LIST_SUCCESS, payload: getUsers() });
  return response;
};

export const logout = () => (dispatch) => {
  logoutUser();
  dispatch({ type: USER_LOGOUT });
};

export const register = (formData) => (dispatch) => {
  dispatch({ type: USER_REGISTER_REQUEST });
  const response = registerUser(formData);

  if (!response.success) {
    dispatch({ type: USER_REGISTER_FAIL, payload: response.message });
    return response;
  }

  dispatch({ type: USER_REGISTER_SUCCESS, payload: response.message });
  dispatch({ type: USER_LIST_SUCCESS, payload: getUsers() });
  return response;
};

export const listUsers = () => (dispatch) => {
  dispatch({ type: USER_LIST_SUCCESS, payload: getUsers() });
};

export const editUserByAdmin = (userId, updates) => (dispatch) => {
  const response = updateUser(userId, updates);
  dispatch({ type: USER_LIST_SUCCESS, payload: getUsers() });
  return response;
};

export const removeUserByAdmin = (userId) => (dispatch) => {
  deleteUser(userId);
  dispatch({ type: USER_LIST_SUCCESS, payload: getUsers() });
};
