import { HOME_STEP } from '../actions/steps';



// Initial State
const initialState = {
    showHomeStep: false
}

// Helper Functions
export default function stepReducer(state = initialState, action: any) {
    switch(action.type) {
        case HOME_STEP:
            return {showHomeStep: action.payload }
        default:
            return state;
    }
}