import { createSlice } from "@reduxjs/toolkit";
import { getCurrentUser, userLogin, userRegister } from "./authActions";

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: false, // login / inscription en cours
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem("token");
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (s) => { s.loading = true; })
      .addCase(userLogin.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.user = payload.user;
        s.token = payload.token;
      })
      .addCase(userLogin.rejected, (s) => { s.loading = false; })
      .addCase(userRegister.pending, (s) => { s.loading = true; })
      .addCase(userRegister.fulfilled, (s) => { s.loading = false; })
      .addCase(userRegister.rejected, (s) => { s.loading = false; })
      .addCase(getCurrentUser.fulfilled, (s, { payload }) => { s.user = payload.user; })
      .addCase(getCurrentUser.rejected, (s) => {
        localStorage.removeItem("token");
        s.token = null;
        s.user = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice;
