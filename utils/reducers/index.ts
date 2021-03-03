import { combineReducers } from 'redux';
import cartReducer from './cart';
import favoritesReducer from './favorite';
import shippingReducer from './shipping';
import propsReducer from './props';
import messagesReducer from './messages';

export default combineReducers({
    cart: cartReducer,
    favorites: favoritesReducer,
    props: propsReducer,
    shipping: shippingReducer,
    messages: messagesReducer
})