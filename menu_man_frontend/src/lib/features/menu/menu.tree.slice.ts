import { createSlice } from "@reduxjs/toolkit";
import { MenuState } from "../../types";
import { fetchMenuTree } from "./menu.thunks";

export const initialState: MenuState = {
  items: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",
};

const MenuTreeSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    resetMenuTreeState(state) {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuTree.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMenuTree.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(fetchMenuTree.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.error.message || "Failed to fetch menu items";
      });
  },
});

export const { resetMenuTreeState } = MenuTreeSlice.actions;
export default MenuTreeSlice.reducer;
