import { SET_SIDE_MENU_STATUS } from '../actions/props';



// Initial State
const initialState = {
    sideMenu: false
}

// Helper Functions
export default function propsReducer(state = initialState, action: any) {
    switch(action.type) {
        case SET_SIDE_MENU_STATUS:
            return {...state, sideMenuState: !state.sideMenu}
        default:
            return state;
    }
}