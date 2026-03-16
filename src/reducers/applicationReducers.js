import {
  APPLICATION_ACTION_FAIL,
  APPLICATION_ACTION_SUCCESS,
  APPLICATION_LIST_SUCCESS,
} from '../constants/applicationConstants';

export const applicationReducer = (state = { applications: [] }, action) => {
  switch (action.type) {
    case APPLICATION_LIST_SUCCESS:
      return { ...state, applications: action.payload || [] };
    case APPLICATION_ACTION_SUCCESS:
      return { ...state, successMessage: action.payload, error: null };
    case APPLICATION_ACTION_FAIL:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
