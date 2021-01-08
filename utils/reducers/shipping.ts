import { SHIPPING, SHIPPING_SET, SHIPPING_SELECT } from '../actions/shipping';


const START_ITEMS: any[] = [
    {
        correo: true,
        selected: true
    },
    {
        correo: false,
        selected: false
    }
];

// Initial State
const initialState = {
    locations: START_ITEMS
}

// Helper Functions
export default function shippingReducer(state = initialState, action: any) {
    switch(action.type) {
        case SHIPPING:
            return {...state, locations: []}
        case SHIPPING_SET:
            return {...state, locations:action.payload}
        case SHIPPING_SELECT:
            const selected = state.locations.map((el: any, index: number) => {if (index === action.payload) { el.selected = true;} else{el.selected = false;} return el;});
            return {...state, selected }
        default:
            return state;
    }
}