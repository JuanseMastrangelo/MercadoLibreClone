import { CART_ADD_PRODUCT, CART_PRODUCTS, CART_REMOVE_PRODUCT, CART_CLEAN } from '../actions/cart';


const START_ITEMS: any[] = [];

// Initial State
const initialState = {
    items: START_ITEMS
}

// Helper Functions
export default function cartReducer(state = initialState, action: any) {
    switch(action.type) {
        case CART_PRODUCTS:
            return {...state, items: []}
        case CART_ADD_PRODUCT:
            return {...state,  items:[...state.items, action.payload]}
        case CART_REMOVE_PRODUCT:
            const products = state.items.filter((el: any) => el.id !== action.payload);
            return {...state, items: products }
        case CART_CLEAN:
            return {...state, items: [] }
        default:
            return state;
    }
}