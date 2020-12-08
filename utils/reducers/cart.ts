import { CART_ADD_PRODUCT, CART_PRODUCTS, CART_REMOVE_PRODUCT } from '../actions/cart';


const START_ITEMS: any[] = [];

// Initial State
const initialState = {
    products: START_ITEMS
}

// Helper Functions
export default function cartReducer(state = initialState, action: any) {
    console.log(state.products.filter((el: any) => el.id !== action.payload));
    switch(action.type) {
        case CART_PRODUCTS:
            return {...state, products: []}
        case CART_ADD_PRODUCT:
            return {...state,  products:[...state.products, action.payload]}
        case CART_REMOVE_PRODUCT:
            const products = state.products.filter((el: any) => el.id !== action.payload);
            return {...state, products }
        default:
            return state;
    }
}