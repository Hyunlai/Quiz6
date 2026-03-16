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

export const userAuthReducer = (state = { currentUser: null }, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    case USER_LOGIN_SUCCESS:
      return { ...state, loading: false, currentUser: action.payload, error: null };
    case USER_LOGIN_FAIL:
      return { ...state, loading: false, error: action.payload };
    case USER_LOAD_SESSION:
      return { ...state, currentUser: action.payload || null };
    case USER_LOGOUT:
      return { ...state, currentUser: null };
    default:
      return state;
  }
};

export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { loading: true };
    case USER_REGISTER_SUCCESS:
      return { loading: false, success: true, message: action.payload };
    case USER_REGISTER_FAIL:
      return { loading: false, success: false, error: action.payload };
    default:
      return state;
  }
};

export const userListReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case USER_LIST_SUCCESS:
      return { ...state, users: action.payload || [] };
    default:
      return state;
  }
};
