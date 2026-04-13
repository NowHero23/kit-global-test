import { z } from "zod";
import { passwordValidation } from "./validation/passwordValidation";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address.").trim(),
  password: passwordValidation,
});

export type LoginActionState = {
  form?: {
    email?: string;
    password?: string;
  };
  errors?: {
    email?: string[];
    password?: string[];
    general?: string[];
  };
};
