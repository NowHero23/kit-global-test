"use client";

import { useAppSelector } from "@/app/hooks/redux";
import { useMemo } from "react";

type TagSuggestionsProps = {
  inputValue: string;
  selectedTags: string[];
  isVisible: boolean;
  onSelect: (tag: string) => void;
};

export function TagSuggestions({
  inputValue,
  selectedTags,
  isVisible,
  onSelect,
}: TagSuggestionsProps) {
  const { availableTags, status } = useAppSelector((state) => state.tagsSlice);

  // useMemo обчислить підказки ТІЛЬКИ тоді, коли зміниться ввід або теги.
  // Це замінює useEffect і прибирає будь-які помилки лінтера.
  const suggestions = useMemo(() => {
    if (!inputValue.trim()) return [];

    const normalizedInput = inputValue.trim().toLowerCase();
    const normalizedSelectedTags = selectedTags.map((tag) => tag.toLowerCase());

    return availableTags.filter((tag) => {
      const normalizedTag = tag.id.toLowerCase();
      const matchesInput = normalizedTag.includes(normalizedInput);
      return matchesInput && !normalizedSelectedTags.includes(normalizedTag);
    });
  }, [inputValue, availableTags, selectedTags]);

  if (!isVisible || suggestions.length === 0) return null;

  if (status !== "succeeded") return null; // Показуємо підказки тільки після успішного завантаження тегів

  return (
    <ul className="absolute z-10 w-full bg-white border rounded-md shadow-lg max-h-40 overflow-auto dark:bg-gray-800 dark:border-gray-700">
      {suggestions.map((suggestion) => (
        <li
          key={suggestion.id}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onSelect(suggestion.id)}
          className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b last:border-none dark:hover:bg-gray-700 dark:border-gray-700"
        >
          {suggestion.id}
        </li>
      ))}
    </ul>
  );
}
