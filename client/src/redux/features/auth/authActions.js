import { createAsyncThunk } from "@reduxjs/toolkit";
import API, { errorMessage } from "../../../services/API";

export const userLogin = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/auth/login", credentials);
      localStorage.setItem("token", data.token);
      return data;
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  }
);

export const userRegister = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/auth/register", payload);
      return data;
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/auth/current-user");
      return data;
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  }
);
