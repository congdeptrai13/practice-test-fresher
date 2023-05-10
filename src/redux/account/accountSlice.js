import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: {
    email: "",
    phone: "",
    fullName: "",
    role: "",
    avatar: "",
    id: ""
  }
};

export const accountSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    doLoginAction: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.isLoading = false;
    },
    doGetAccountAction: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.isLoading = false;
    },
    doLogoutAction: (state) => {
      state.isAuthenticated = false;
      localStorage.setItem("access_token", "");
      state.user = {
        email: "",
        phone: "",
        fullName: "",
        role: "",
        avatar: "",
        id: ""
      }
    },
    doUploadUserInfoAction: (state, action) => {
      state.user.avatar = action.payload.avatar
      state.user.phone = action.payload.phone
      state.user.fullName = action.payload.fullName
    }
  }
});

export const { doLoginAction, doGetAccountAction, doLogoutAction, doUploadUserInfoAction } = accountSlice.actions;

export default accountSlice.reducer;
