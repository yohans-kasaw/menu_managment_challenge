import { createSlice } from "@reduxjs/toolkit";
import { MenuState } from "../../types";
import { updateMenuItem } from "./menu.thunks";

export const initialState: MenuState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",
};

const MenuUpdateSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    resetMenuUpdateState(state) {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateMenuItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateMenuItem.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(updateMenuItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.error.message || "Failed to update menu item";
      });
  },
});

export const { resetMenuUpdateState } = MenuUpdateSlice.actions;
export default MenuUpdateSlice.reducer;
