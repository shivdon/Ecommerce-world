export const pageStateReducer = (state = false, action) => {
    switch(action.type){
        case "SESSION":
            return action.payload
        default:
            return state
    }
}