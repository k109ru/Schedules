import {actionTypes} from '../actions';
import adminReducer from './adminReducer';

test('returns default initial state of `{deletedAdmin: empty array}` when no action is passed', () => {
  const newState = adminReducer(undefined, {});
  expect(newState).toEqual({deletedAdmin: []});
});

test('returns state with one added deletedAdmin', () => {
  const newState = adminReducer(undefined, {
    type: actionTypes.DELETE_ADMIN,
    payload: 'user',
  });
  expect(newState).toEqual({deletedAdmin: ['user']});
});
