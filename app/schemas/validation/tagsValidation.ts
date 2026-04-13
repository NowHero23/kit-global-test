import z from "zod";

export const tagsValidation = z
  .string()
  .transform((val) => {
    if (!val) return [];
    // Розбиваємо рядок і мапимо його в об'єкти Tag
    return val.split(",").map((tagId) => ({
      id: tagId.trim().toLowerCase(),
    }));
  })
  // Тепер перевіряємо масив об'єктів
  .pipe(
    z
      .array(
        z.object({
          id: z.string(),
        }),
      )
      .min(1, "Add at least one tag"),
  );
