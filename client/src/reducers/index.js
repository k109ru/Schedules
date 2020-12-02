import {combineReducers} from 'redux';
import userReducer from './userReducer';
import scheduleReducer from './scheduleReducer';
import employeeReducer from './employeeReducer';
import adminReducer from './adminReducer';
import authorization from './authorizationReducer';

export default combineReducers({
  usersObj: userReducer,
  scheduleObj: scheduleReducer,
  employeeObj: employeeReducer,
  adminObj: adminReducer,
  authorizationObj: authorization,
});
