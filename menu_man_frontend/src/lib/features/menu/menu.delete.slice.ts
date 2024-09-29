import { createSlice } from "@reduxjs/toolkit";
import { MenuState } from "../../types";
import { deleteMenuItem } from "./menu.thunks";

export const initialState: MenuState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",
};

const MenuDeleteSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    resetMenuDeleteState(state) {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteMenuItem.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(deleteMenuItem.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(deleteMenuItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.error.message || "Failed to delete menu item";
      });
  },
});


export const { resetMenuDeleteState } = MenuDeleteSlice.actions;
export default MenuDeleteSlice.reducer;
