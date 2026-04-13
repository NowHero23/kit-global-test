import { combineReducers, configureStore } from "@reduxjs/toolkit";
import tagsSlice from './reducers/tagsSlice';

const rootReducer = combineReducers({
  tagsSlice
});
export const setupStore = () => configureStore({ reducer: rootReducer });
export type RootState = ReturnType<typeof rootReducer>;

export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];