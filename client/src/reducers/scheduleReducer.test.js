import {actionTypes} from '../actions';
import scheduleReducer from './scheduleReducer';

test('returns default initial state of `{deletedAdmin: empty array}` when no action is passed', () => {
  const newState = scheduleReducer(undefined, {});
  expect(newState).toEqual({
    deletedSchedule: [],
  });
});

test('returns state with one deletedSchedule', () => {
  const newState = scheduleReducer(undefined, {
    type: actionTypes.DELETE_SCHEDULE,
    payload: 'id:123412398745018345',
  });
  expect(newState).toEqual({
    deletedSchedule: ['id:123412398745018345'],
  });
});
