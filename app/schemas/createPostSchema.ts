import z from "zod";

export const createPostSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .min(10, "Мінімум 10 символів")
    .max(120, "Максимум 120 символів")
    .trim(),
  description: z
    .string()
    .min(20, "Мінімум 20 символів")
    .max(500, "Максимальна довжина 500 символів")
    .trim(),
  content: z
    .string()
    .min(20, "Мінімум 20 символів")
    .max(50000, "Максимальна довжина 50000 символів")
    .trim(),
});

export type CreateActionState = {
  form?: {
    title?: string;
    description?: string;
    content?: string;
  };
  errors?: {
    title?: string[];
    description?: string[];
    content?: string[];
    general?: string[];
  };
};
