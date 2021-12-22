import { combineReducers } from "redux";
import OrgSelectorReducer from "./OrgSelectionReducer"
import authReducer from "./AuthReducer";

const combinedReducers = combineReducers({
    OrgSelectorReducer,authReducer

})

export default combinedReducers;