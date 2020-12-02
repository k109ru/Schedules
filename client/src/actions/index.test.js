// folder testing test_react ====> storeFactory
import {storeFactory} from '../test/testUtils';
import {
  actionTypes,
  deletedAdmin,
  authorization,
  deletedSchedule,
  deletedEmployee,
  addedEmployee,
  addedUser,
} from './index';

const store = storeFactory();

test('should create an action to add deleted admin', () => {
  const admin = 'user';

  const expectedAction = {
    type: actionTypes.DELETE_ADMIN,
    payload: admin,
  };
  // console.log(store.dispatch(deletedAdmin(admin)));

  expect(store.dispatch(deletedAdmin(admin))).toEqual(expectedAction);
});

test('should create an action to add authorization info', () => {
  const auth = [
    {
      signedId: true,
      name: 'user',
      email: 'user@k109.ru',
    },
  ];

  const expectedAction = {
    type: actionTypes.AUTHORIZATION,
    payload: auth,
  };

  expect(store.dispatch(authorization(auth))).toEqual(expectedAction);
});

test('should create an action to add deleted schedule', () => {
  const schedule = 'id:123412398745018345';

  const expectedAction = {
    type: actionTypes.DELETE_SCHEDULE,
    payload: schedule,
  };
  // console.log(store.dispatch(deletedAdmin(admin)));

  expect(store.dispatch(deletedSchedule(schedule))).toEqual(expectedAction);
});

test('should create an action to add deleted employee', () => {
  const user = 'user';

  const expectedAction = {
    type: actionTypes.DELETE_EMPLOYEE,
    payload: user,
  };
  // console.log(store.dispatch(deletedAdmin(admin)));

  expect(store.dispatch(deletedEmployee(user))).toEqual(expectedAction);
});

test('should create an action to add added employee', () => {
  const user = 'user';

  const expectedAction = {
    type: actionTypes.ADD_EMPLOYEE,
    payload: user,
  };
  // console.log(store.dispatch(deletedAdmin(admin)));

  expect(store.dispatch(addedEmployee(user))).toEqual(expectedAction);
});

test('should create an action to add added user', () => {
  const user = 'user';

  const expectedAction = {
    type: actionTypes.ADD_USER,
    payload: user,
  };
  // console.log(store.dispatch(deletedAdmin(admin)));

  expect(store.dispatch(addedUser(user))).toEqual(expectedAction);
});
