import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "./slice/CartSlice";
import OrderReducer from "./slice/OrderSlice";
import PlaceOrderReducer from "./slice/PlaceOrderSlice";

export const store = configureStore({
  reducer: {
    cart: CartReducer,
    order: OrderReducer,
    placeorder: PlaceOrderReducer,
  },
});
