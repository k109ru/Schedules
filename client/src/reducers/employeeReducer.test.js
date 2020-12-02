import {actionTypes} from '../actions';
import employeeReducer from './employeeReducer';

test('returns default initial state of `{empty arrays}` when no action is passed', () => {
  const newState = employeeReducer(undefined, {});
  expect(newState).toEqual({
    deletedEmployee: [],
    addedEmployee: [],
  });
});

test('returns state with one added deletedEmployee', () => {
  const newState = employeeReducer(undefined, {
    type: actionTypes.DELETE_EMPLOYEE,
    payload: 'user',
  });
  expect(newState).toEqual({
    addedEmployee: [],
    deletedEmployee: ['user'],
  });
});

test('returns state with one added addedEmployee', () => {
  const newState = employeeReducer(undefined, {
    type: actionTypes.ADD_EMPLOYEE,
    payload: 'user',
  });
  expect(newState).toEqual({
    addedEmployee: ['user'],
    deletedEmployee: [],
  });
});
