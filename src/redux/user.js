import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchIsAdminData } from "../util/api";

const initialState = {
  users: {},
  isFetchAdminDataLoading: false,
  adminList: [],
  isAdmin: false,
};

export const handleFetchAdmin = createAsyncThunk(
  "user/fetchAdmin",
  async () => {
    const response = await fetchIsAdminData();
    return response.data;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    handleIsAdmin: (state, action) => {
      state.isAdmin = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(handleFetchAdmin.pending, (state) => {
      state.isFetchAdminDataLoading = true;
    });
    builder.addCase(handleFetchAdmin.fulfilled, (state, action) => {
      state.isFetchAdminDataLoading = false;
      state.adminList = action.payload;
    });
  },
});

export const { handleIsAdmin } = userSlice.actions;

export default userSlice.reducer;
