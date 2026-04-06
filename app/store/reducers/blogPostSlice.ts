import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  search: string;
  tags: string[];
}

const initialState: FilterState = {
  search: "",
  tags: [],
};
const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setTags(state, action: PayloadAction<string[]>) {
      state.tags = action.payload;
    },
    addTag(state, action: PayloadAction<string>) {
      state.tags.push(action.payload);
    },
    removeTag(state, action: PayloadAction<string>) {
      state.tags = state.tags.filter((t) => t != action.payload);
    },
    clearTags(state) {
      state.tags = [];
    },
  },
});

export default filterSlice.reducer;
export const { setSearch, setTags, addTag, removeTag, clearTags } =
  filterSlice.actions;
