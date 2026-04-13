"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import { fetchAllTags } from "./reducers/tagsSlice";

export function ReduxInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.tagsSlice.status);

  useEffect(() => {
    // Завантажуємо теги тільки якщо вони ще не завантажені
    console.log("ReduxInitializer: Checking tags status:", status);
    if (status === "idle") {
      dispatch(fetchAllTags());
    }
  }, [status, dispatch]);

  return <>{children}</>;
}
