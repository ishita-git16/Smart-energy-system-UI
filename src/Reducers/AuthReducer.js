const authReducer = (
  state = {
    isLogged: false,
  },
  action
) => {
  var newState;
  switch (action.type) {
    case "SET_LOGGED":
      newState = { ...action.payload };
      return newState;

    case "REMOVE_LOGGED":
      newState = {};
      newState.isLogged = false;
      return newState;

    default:
      return state;
  }
};
export default authReducer;
