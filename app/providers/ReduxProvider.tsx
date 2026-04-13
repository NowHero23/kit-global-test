"use client";

import * as React from "react";
import { Provider } from "react-redux";
import { setupStore } from "../redux/store";
import { ReduxInitializer } from "../redux/ReduxInitializer";

export const ReduxProvider: React.FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  const store = setupStore();

  return (
    <Provider store={store}>
      <ReduxInitializer>{children}</ReduxInitializer>
    </Provider>
  );
};
