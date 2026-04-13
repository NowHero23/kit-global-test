"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAppSelector } from "@/app/hooks/redux";
import { Button } from "../Button";

export function TagFilter() {
  const { availableTags, status } = useAppSelector((state) => state.tagsSlice);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Беремо початкові теги з URL
  const currentTags = searchParams.get("tags")?.split(",") || [];
  const [selected, setSelected] = useState<string[]>(currentTags);

  const TAG_LIMIT = 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (selected.length > 0) {
      params.set("tags", selected.join(","));
    } else {
      params.delete("tags");
    }
    params.delete("lastId");
    router.push(`?${params.toString()}`);
  };

  const handleReset = () => {
    setSelected([]);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("tags");
    params.delete("lastId");
    router.push(`?${params.toString()}`);
  };

  if (status !== "succeeded") return null; // Показуємо фільтр тільки після успішного завантаження тегів

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded-lg mb-6 dark:border-gray-700 w-full"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold">
          Фільтр тегів ({selected.length}/{TAG_LIMIT})
        </h3>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-red-500 hover:underline"
          >
            Скинути всі
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        {availableTags.map((tag) => {
          const isChecked = selected.includes(tag.id);
          const isDisabled = !isChecked && selected.length >= TAG_LIMIT;

          return (
            <label
              key={tag.id}
              className={`flex items-center gap-2 cursor-pointer px-3 py-1 rounded-full transition ${
                isChecked
                  ? "bg-blue-100 dark:bg-blue-900"
                  : "bg-gray-100 dark:bg-gray-800"
              } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                disabled={isDisabled}
                onChange={(e) => {
                  if (e.target.checked) {
                    if (selected.length < TAG_LIMIT)
                      setSelected([...selected, tag.id]);
                  } else {
                    setSelected(selected.filter((t) => t !== tag.id));
                  }
                }}
                className="hidden" // Ховаємо стандартний чекбокс для гарного UI
              />
              <span className="text-sm">#{tag.id}</span>
            </label>
          );
        })}
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-800 transition disabled:bg-gray-400"
      >
        Застосувати фільтри
      </Button>

      {selected.length >= TAG_LIMIT && (
        <p className="text-xs text-amber-500 mt-2">
          Ви досягли ліміту в 10 тегів для пошуку.
        </p>
      )}
    </form>
  );
}
