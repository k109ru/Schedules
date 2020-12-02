export default (
  state = {
    names: [],
  },
  action,
) => {
  switch (action.type) {
    case 'ADD_USER': {
      const names = state.names.concat(action.payload);
      return {...state, names};
    }
    default: {
      return state;
    }
  }
};
