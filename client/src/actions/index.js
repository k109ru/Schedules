export const actionTypes = {
  DELETE_ADMIN: 'DELETE_ADMIN',
  AUTHORIZATION: 'AUTHORIZATION',
  DELETE_SCHEDULE: 'DELETE_SCHEDULE',
  DELETE_EMPLOYEE: 'DELETE_EMPLOYEE',
  ADD_EMPLOYEE: 'ADD_EMPLOYEE',
  ADD_USER: 'ADD_USER',
};

export const deletedAdmin = (delAdmin) => (dispatch) => {
  return dispatch({
    type: actionTypes.DELETE_ADMIN,
    payload: delAdmin,
  });
};

export const authorization = (data) => (dispatch) => {
  return dispatch({
    type: actionTypes.AUTHORIZATION,
    payload: data,
  });
};

export const deletedSchedule = (delSchedule) => (dispatch) => {
  return dispatch({
    type: actionTypes.DELETE_SCHEDULE,
    payload: delSchedule,
  });
};

export const deletedEmployee = (delEmployee) => (dispatch) => {
  return dispatch({
    type: actionTypes.DELETE_EMPLOYEE,
    payload: delEmployee,
  });
};

export const addedEmployee = (addEmployee) => (dispatch) => {
  return dispatch({
    type: actionTypes.ADD_EMPLOYEE,
    payload: addEmployee,
  });
};

export const addedUser = (addUser) => (dispatch) => {
  return dispatch({
    type: actionTypes.ADD_USER,
    payload: addUser,
  });
};
