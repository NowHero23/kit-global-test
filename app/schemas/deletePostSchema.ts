import z from "zod";

export const deletePostSchema = z.object({
  slug: z.string(),
  userId: z.string(),
});

export type DeletePostActionState = {
  form?: {
    slug?: string;
    userId?: string;
  };
  errors?: {
    slug?: string[];
    userId?: string[];
  };
};
