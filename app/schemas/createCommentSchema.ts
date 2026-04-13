import z from "zod";

export const createCommentSchema = z.object({
  postId: z.string().trim(),
  content: z
    .string()
    .trim()
    .min(1, "Мінімум 1 символ")
    .max(200, "Максимальна довжина 200 символів"),
});

export type CreateCommentActionState = {
  form?: {
    postId?: string;
    authorId?: string;
    content?: string;
  };
  errors?: {
    postId?: string[];
    content?: string[];
    general?: string[];
  };
};
