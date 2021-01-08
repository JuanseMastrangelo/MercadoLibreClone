import { FAVORITE_ADD_PRODUCT, FAVORITE_PRODUCTS, FAVORITE_REMOVE_PRODUCT, FAVORITE_CLEAN, FAVORITE_FORCE} from '../actions/favorite';


const START_ITEMS: any[] = [];

// Initial State
const initialState = {
    items: START_ITEMS
}

// Helper Functions
export default function favoritesReducer(state = initialState, action: any) {
    switch(action.type) {
        case FAVORITE_PRODUCTS:
            return {...state, items: []}
        case FAVORITE_ADD_PRODUCT:
            return {...state,  items:[...state.items, action.payload]}
        case FAVORITE_REMOVE_PRODUCT:
            const items = state.items.filter((el: any) => el.id !== action.payload);
            return {...state, items }
        case FAVORITE_CLEAN:
            return {...state, items: [] }
        case FAVORITE_FORCE:
            return {...state, items: action.payload }
        default:
            return state;
    }
}