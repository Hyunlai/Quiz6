import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';
import { chatReducer } from './reducers/chatReducers';
import { orderReducer } from './reducers/orderReducers';
import { applicationReducer } from './reducers/applicationReducers';
import { sellerServiceReducer, serviceListReducer } from './reducers/serviceReducers';
import { userAuthReducer, userListReducer, userRegisterReducer } from './reducers/userReducers';

const reducer = combineReducers({
  userAuth: userAuthReducer,
  userRegister: userRegisterReducer,
  userList: userListReducer,
  serviceList: serviceListReducer,
  sellerServices: sellerServiceReducer,
  applicationData: applicationReducer,
  orderData: orderReducer,
  chatData: chatReducer,
});

const initialState = {};
const middleware = [thunk];

const store = createStore(reducer, initialState, applyMiddleware(...middleware));

export default store;
