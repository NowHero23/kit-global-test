import z from "zod";
import { CreateActionState } from "./createPostSchema";

export const editPostSchema = z.object({
  id: z.string(),
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

export type EditActionState = CreateActionState & {
  form?: CreateActionState["form"] & {
    id?: string;
    userId?: string;
  };
  errors?: CreateActionState["errors"] & {
    id?: string[];
    userId?: string[];
  };
};
