import { configureStore } from "@reduxjs/toolkit";
import MenuAddReducer from "./features/menu/menu.add.slice"
import MenuDeleteReducer from "./features/menu/menu.delete.slice"
import MenuUpdateReducer from "./features/menu/menu.update.slice"
import MenuTreeReducer from "./features/menu/menu.tree.slice"

export const makeStore = () => {
  return configureStore({
    reducer: {
      menuTree: MenuTreeReducer,
      menuAdd: MenuAddReducer,
      menuDelete: MenuDeleteReducer,
      menuUpdate: MenuUpdateReducer
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
