export const drawerReducer = (state = false, action) => {
    switch(action.type){
        case "DRAWER_VISIBILITY":
            return action.payload
        default:
            return state
    }
}