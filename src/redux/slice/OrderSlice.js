import { createSlice } from "@reduxjs/toolkit";

const OrderSlice = createSlice({
  name: "order",
  initialState: {
    data: [],
  },
  reducers: {
    forEditOrder(state, action) {
      let tempData = state.data;
      tempData.push(action.payload);
      state.data = tempData;
    },
    emptyOrder(state, action) {
        state.data = action.payload;
      },
  },
});

export const { forEditOrder, emptyOrder } = OrderSlice.actions;

export default OrderSlice.reducer;
