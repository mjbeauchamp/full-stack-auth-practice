//Create our initial store state
//This value is only used ONCE, when our app initially runs, before a store state exists
//This runs at the very beginning of when you open a page, before the componentDidMount thing
const initialState ={
    user: {}
}

//Define your switch option strings as variables to avoid typo errors
const USER_DATA = "USER-DATA"

//Action-creator function
//We'll pass in the parameter WHEN we invoke the function in our component (when the action-creator function gets triggered)
export function getUserData(user){
    return {
        type: USER_DATA,
        payload: user
    }
}

//Create our reducer
//This is what will handle any incoming actions that are triggered from a component and get sent to the store
export default function reducer(state=initialState, action){
    switch (action.type) {
        case USER_DATA:
            return Object.assign({}, state, {user: action.payload});
        default:
            return state;
    }
}