export default (
  state = {
    deletedEmployee: [],
    addedEmployee: [],
  },
  action,
) => {
  switch (action.type) {
    case 'DELETE_EMPLOYEE': {
      const deletedEmployee = state.deletedEmployee.concat(action.payload);
      return {...state, deletedEmployee};
    }
    case 'ADD_EMPLOYEE': {
      const addedEmployee = state.addedEmployee.concat(action.payload);
      return {...state, addedEmployee};
    }
    default: {
      return state;
    }
  }
};
