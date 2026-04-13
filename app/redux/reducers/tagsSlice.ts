import { getAllTags } from "@/app/blog/firebase";
import Tag from "@/app/types/tag";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface TagsState {
  availableTags: Tag[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TagsState = {
  availableTags: [],
  status: "idle",
  error: null,
};

// Асинхронний запит до Firebase
export const fetchAllTags = createAsyncThunk("tags/fetchAll", async () => {
  const response = await getAllTags();
  // Повертаємо масив імен тегів (це потрапить у payload екшену fulfilled)
  return response; // Повертаємо весь об'єкт тегу
});

const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    // Тут можна додати звичайні редюсери, наприклад, очистити кеш вручну
    clearCache(state) {
      state.availableTags = [];
      state.status = "idle";
    },
  },
  // 3. extraReducers - тут ми обробляємо життєвий цикл Thunk
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTags.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchAllTags.fulfilled,
        (state, action: PayloadAction<Tag[]>) => {
          state.status = "succeeded";
          state.availableTags = action.payload; // Записуємо отримані теги в кеш
        },
      )
      .addCase(fetchAllTags.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default tagsSlice.reducer;
export const { clearCache } = tagsSlice.actions;
