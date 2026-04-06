import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.email("Invalid email address.").trim(),
    password: z
      .string()
      .trim()
      .min(8, { message: "Be at least 8 characters long." })
      .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
      .regex(/[0-9]/, { message: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Contain at least one special character.",
      }),
    confirmPassword: z
      .string()
      .trim()
      .min(8, { message: "Be at least 8 characters long." }),
    nickname: z
    .string()
    .min(5, { message: "Be at least 5 characters long." })
    .max(30, { message: "Be at most 30 characters long." }).trim(),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password is not the same as confirm password.",
        path: ["confirmPassword"],
      });
    }
  });

export type RegisterActionState = {
  form?: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    nickname?: string;
  };
  errors?: {
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    nickname?: string[];
    general?: string[];
  };
};
