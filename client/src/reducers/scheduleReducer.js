export default (
  state = {
    deletedSchedule: [],
  },
  action,
) => {
  switch (action.type) {
    case 'DELETE_SCHEDULE': {
      const deletedSchedule = state.deletedSchedule.concat(action.payload);
      return {...state, deletedSchedule};
    }
    default: {
      return state;
    }
  }
};
