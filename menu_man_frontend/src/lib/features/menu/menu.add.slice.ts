import { createSlice } from "@reduxjs/toolkit";
import { MenuState } from "../../types";
import { createMenuItem } from "./menu.thunks";

export const initialState: MenuState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",
};

const MenuAddSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    resetMenuAddState(state) {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createMenuItem.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(createMenuItem.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(createMenuItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.error.message || "Failed to create menu item";
      });
  },
});


export const { resetMenuAddState } = MenuAddSlice.actions;
export default MenuAddSlice.reducer;
