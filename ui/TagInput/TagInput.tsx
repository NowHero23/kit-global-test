"use client";

import { useState, KeyboardEvent, useCallback } from "react";
import { ErrorList } from "../Form/ErrorList/ErrorList";
import { useFormContext } from "../Form/Form";
import z from "zod";
import { cn } from "../classNames";
import { TagSuggestions } from "./TagSuggestions";

type TagInputProps = {
  name: string;
  fieldSchema: z.ZodTypeAny;
  errors?: string[];
  defaultValue?: string[];
};

export function TagInput({
  name,
  fieldSchema,
  errors,
  defaultValue = [],
}: TagInputProps) {
  const { wasSubmitted } = useFormContext();
  const [tags, setTags] = useState<string[]>(defaultValue);
  const [inputValue, setInputValue] = useState("");
  const [touched, setTouched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const getErrors = useCallback(() => {
    const serializedTags = tags.join(",");
    const validationResult = fieldSchema.safeParse(serializedTags);
    return validationResult.success
      ? []
      : validationResult.error.flatten().formErrors;
  }, [fieldSchema, tags]);

  const fieldErrors = errors || getErrors();
  const shouldRenderErrors =
    fieldErrors.length > 0 && (touched || wasSubmitted);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue) {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const addTag = (tag: string) => {
    const normalizedTag = tag.trim().toLowerCase();
    if (normalizedTag && !tags.includes(normalizedTag)) {
      setTags([...tags, normalizedTag]);
      setInputValue("");
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
    setTouched(true);
  };

  return (
    <div className="relative space-y-2">
      <input type="hidden" name={name} value={tags.join(",")} />

      <div
        className={cn(
          `flex flex-wrap gap-2 p-2 border rounded-md min-h-11 dark:border-gray-600 dark:placeholder-gray-400 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus-within:ring-1 ring-blue-500 `,
          shouldRenderErrors && "border-red-500 dark:border-red-500",
        )}
      >
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center text-sm"
          >
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1 text-blue-500 hover:text-red-500 font-bold cursor-pointer"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setTouched(true);
            setIsFocused(false);
          }}
          placeholder={tags.length === 0 ? "Add tags..." : ""}
          className="flex-1 outline-none min-w-30 bg-transparent"
        />
      </div>

      {shouldRenderErrors && <ErrorList errors={fieldErrors} />}

      {/* Виносимо логіку підказок в окремий ізольований компонент */}

      <TagSuggestions
        inputValue={inputValue}
        selectedTags={tags}
        isVisible={isFocused}
        onSelect={addTag}
      />
    </div>
  );
}
