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
      // console.log(state.carts);
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
    }
  }
});

export const { doAddToCart } = orderSlice.actions;

export default orderSlice.reducer;
