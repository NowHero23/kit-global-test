import { combineReducers, configureStore } from "@reduxjs/toolkit";
import blogPostSlice from './reducers/blogPostSlice';

const rootReducer = combineReducers({
  blogPostSlice,
});
export const setupStore = () => configureStore({ reducer: rootReducer });
export type RootState = ReturnType<typeof rootReducer>;

export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];