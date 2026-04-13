import { z } from "zod";
import { passwordValidation } from "./validation/passwordValidation";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address.").trim(),
  password: passwordValidation,
  confirmPassword: passwordValidation,
  nickname: z
    .string()
    .min(5, { message: "Be at least 5 characters long." })
    .max(30, { message: "Be at most 30 characters long." })
    .trim(),
});
// .refine((data) => data.password === data.confirmPassword, {
//   message: "Password is not the same as confirm password.",
//   path: ["confirmPassword"],
// });

// .superRefine(({ password, confirmPassword }, ctx) => {
//   if (confirmPassword !== password) {
//     ctx.addIssue({
//       code: "custom",
//       message: "Passwords do not match",
//       path: ["confirmPassword"], // Вказуємо шлях до поля
//     });
//   }
// });

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
