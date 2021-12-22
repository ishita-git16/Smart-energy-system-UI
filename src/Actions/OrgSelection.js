export const org_Selection = (orgOptions) => {
    
    
    return {
        type: "SET_ORG_LIST",
        payload: orgOptions
    }
}   

export const set_current_org = (current_org) => {
    
    
    return {
        type: "CURRENT_SELECTED_ORG",
        payload: current_org
    }
}   