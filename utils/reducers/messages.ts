import { NOT_SEE_MESSAGES } from '../actions/messages';



// Initial State
const initialState = {
    count: 0
}

// Helper Functions
export default function messagesReducer(state = initialState, action: any) {
    switch(action.type) {
        case NOT_SEE_MESSAGES:
            return {count: action.payload }
        default:
            return state;
    }
}