import { createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
const initialState = {
  carts: []
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    doAddToCart: (state, action) => {
      const { changeAmount, dataDetailsBook } = action.payload;
      const checkOrderItem = state.carts.findIndex(item => item.id === dataDetailsBook._id)
      if (checkOrderItem > -1) {
        if ((changeAmount + state.carts[checkOrderItem].quantity) > dataDetailsBook.quantity) {
          state.carts[checkOrderItem].quantity = dataDetailsBook.quantity;
        } else {
          state.carts[checkOrderItem].quantity += changeAmount
        }
      }
      else {
        let orderItem = {};
        orderItem.quantity = changeAmount;
        orderItem.id = dataDetailsBook._id;
        orderItem.details = { ...dataDetailsBook }
        state.carts.push(orderItem);
        message.success("Sản phẩm đã được thêm vào giỏ hàng")
      }
    },
    doUpdateQuantityToCart: (state, action) => {
      let updateCartQuantity = state.carts.findIndex(item => item.id === action.payload.itemId)
      if (updateCartQuantity > -1)
        state.carts[updateCartQuantity].quantity = action.payload.value;
    },
    doRemoveCart: (state, action) => {
      state.carts = state.carts.filter((item) => item.id !== action.payload)
    },
    doResetCart: (state, action) => {
      state.carts = []
    }
  }
});

export const { doAddToCart, doUpdateQuantityToCart, doRemoveCart, doResetCart } = orderSlice.actions;

export default orderSlice.reducer;
