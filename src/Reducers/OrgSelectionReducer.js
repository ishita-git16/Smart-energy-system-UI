const OrgSelectorReducer = (state = {org_list:[]} , action) => {
  var newState = [];
  switch (action.type) {
    case "SET_ORG_LIST":
      newState = action.payload;
      return newState;
      case "CURRENT_SELECTED_ORG":
      newState = {
        current_org: action.payload, org_list: state.org_list
      };
      return newState;
    default:
      return state;
  }
};

export default OrgSelectorReducer;
