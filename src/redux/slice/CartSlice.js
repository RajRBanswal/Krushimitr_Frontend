import { createSlice } from "@reduxjs/toolkit";

const CartSlice = createSlice({
  name: "cart",
  initialState: {
    data: [],
  },
  reducers: {
    addToCart(state, action) {
      let tempData = state.data;
      let isItemExist = false;
      tempData.map((item) => {
        if (
          item._id === action.payload._id &&
          item.productSize.size === action.payload.productSize.size
        ) {
          isItemExist = true;
          item.quantity = item.quantity + 1;
        }
      });
      if (!isItemExist) {
        tempData.push(action.payload);
      }
      state.data = tempData;
    },
    reduceFromCart(state, action) {
      let tempData = state.data;
      tempData.map((item) => {
        if (
          item._id == action.payload._id &&
          item.productSize.size === action.payload.productSize.size
        ) {
          item.quantity = item.quantity - 1;
        }
      });
      state.data = tempData;
    },
    removeFromCart(state, action) {
      let tempData = state.data;
      tempData = tempData.splice(action.payload, 1);
      state.data = tempData;
    },
    emptyCart(state, action) {
      state.data = action.payload;
    },
  },
});

export const { addToCart, reduceFromCart, removeFromCart, emptyCart } =
  CartSlice.actions;
export default CartSlice.reducer;
