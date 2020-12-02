export default (
  state = {
    authorization: [
      {
        signedIn: false,
        name: null,
        email: null,
      },
    ],
  },
  action,
) => {
  switch (action.type) {
    case 'AUTHORIZATION': {
      const authorization = action.payload;
      return {...state, authorization};
    }
    default: {
      return state;
    }
  }
};
