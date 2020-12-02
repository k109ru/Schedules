import {actionTypes} from '../actions';
import userReducer from './userReducer';

// test('reducers', () => {
//     let state;
//     state = reducers({usersObj:{names:[]},emailsObj:{emails:[]},scheduleObj:{deletedSchedule:[]},employeeObj:{deletedEmployee:[],addedEmployee:[]},adminObj:{deletedAdmin:[]},authorizationObj:{authorization:[{signedIn:false,name:null,email:null}]}}, {type:'AUTHORIZATION',payload:[{name:'Sergey',email:'1@1.ru',signedIn:true}]});
//     expect(state).toEqual({usersObj:{names:[]},emailsObj:{emails:[]},scheduleObj:{deletedSchedule:[]},employeeObj:{deletedEmployee:[],addedEmployee:[]},adminObj:{deletedAdmin:[]},authorizationObj:{authorization:[{name:'Sergey',email:'1@1.ru',signedIn:true}]}});
//   });

// beforeEach(() => {
//     userReducer({names: ['Firstname']}, {type: actionTypes.ADD_USER});
// })

test('returns default initial state of `{names: empty array}` when no action is passed', () => {
  const newState = userReducer(undefined, {});
  expect(newState).toEqual({names: []});
});

test('returns state with one added user', () => {
  const newState = userReducer(undefined, {
    type: actionTypes.ADD_USER,
    payload: 'user',
  });
  expect(newState).toEqual({names: ['user']});
});

test('returns state with added new user2', () => {
  const newState = userReducer(
    {names: ['user1']},
    {type: actionTypes.ADD_USER, payload: 'user2'},
  );
  expect(newState).toEqual({names: ['user1', 'user2']});
});
