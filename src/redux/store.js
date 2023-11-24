import { configureStore } from '@reduxjs/toolkit';
import CartReducer from './slice/CartSlice';
import OrderReducer from './slice/OrderSlice';

export const store = configureStore({
    reducer: {
        cart: CartReducer,
        order: OrderReducer
    }
})