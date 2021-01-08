import { SHIPPING, SHIPPING_EDIT, SHIPPING_SELECT } from '../actions/shipping';


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
        case SHIPPING_EDIT:
            console.log(action.payload);
            // return {...state,  locations:[...state.locations, action.payload]}
            return state;
        case SHIPPING_SELECT:
            const selected = state.locations.map((el: any, index: number) => {if (index === action.payload) { el.selected = true;} else{el.selected = false;} return el;});
            return {...state, selected }
        default:
            return state;
    }
}