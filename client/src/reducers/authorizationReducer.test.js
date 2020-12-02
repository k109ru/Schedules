import {actionTypes} from '../actions';
import authorizationReducer from './authorizationReducer';

test('returns default initial state `authorization: [{signedIn: false, name: null, email: null}]` when no action is passed', () => {
  const newState = authorizationReducer(undefined, {});
  expect(newState).toEqual({
    authorization: [
      {
        signedIn: false,
        name: null,
        email: null,
      },
    ],
  });
});

test('returns with one authorizated user', () => {
  const newState = authorizationReducer(undefined, {
    type: actionTypes.AUTHORIZATION,
    payload: [
      {
        signedIn: true,
        name: 'user',
        email: 'user@k109.ru',
      },
    ],
  });

  expect(newState).toEqual({
    authorization: [
      {
        signedIn: true,
        name: 'user',
        email: 'user@k109.ru',
      },
    ],
  });
});
