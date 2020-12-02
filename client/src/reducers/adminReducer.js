export default (
  state = {
    deletedAdmin: [],
  },
  action,
) => {
  switch (action.type) {
    case 'DELETE_ADMIN': {
      const deletedAdmin = state.deletedAdmin.concat(action.payload);
      return {...state, deletedAdmin};
    }
    default: {
      return state;
    }
  }
};
