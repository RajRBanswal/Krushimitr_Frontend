import { createSlice } from "@reduxjs/toolkit";

const PlaceOrderSlice = createSlice({
  name: "placeorder",
  initialState: {
    data: [],
  },
  reducers: {
    addSizes(state, action) {
      let tempData = state.data;
      let isItemExist = false;
      tempData.map((item) => {
        if (item.size === action.payload.size) {
          isItemExist = true;
          item.quantity = action.payload.quantity;
          item.finalAmount = action.payload.finalAmount;
          item.gsttotal = action.payload.gsttotal;
          item.taxable = action.payload.taxable;
        }
      });
      if (!isItemExist) {
        tempData.push(action.payload);
      }
      state.data = tempData;
    },

    deleteSize(state, action) {
      let tempData = state.data;
      if (action.payload === 0) {
        tempData.splice(action.payload, 1);
      } else {
        tempData.splice(action.payload);
        console.log(tempData);
      }
      state.data = tempData;
      
    },
    emptyPlaceOrder(state, action) {
      state.data = action.payload;
    },
  },
});

export const { addSizes, deleteSize, emptyPlaceOrder } =
  PlaceOrderSlice.actions;

export default PlaceOrderSlice.reducer;
