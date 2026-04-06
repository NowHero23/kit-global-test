"use server";

import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { redirect } from "next/navigation";
import { getFirebaseApp } from "@/app/firebase";
import {
  RegisterActionState,
  registerSchema,
} from "@/app/schemas/registerSchema";
import { createUser } from "../auth/firebase";

export async function RegisterAction(
  _prev: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> {
  const form = Object.fromEntries(formData);
  const validationResult = registerSchema.safeParse(form);
  if (!validationResult.success) {
    return {
      form,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }
  let success = false;
  try {
    console.log(validationResult.data);
    const userCredential = await createUserWithEmailAndPassword(
      getAuth(getFirebaseApp()),
      validationResult.data.email,
      validationResult.data.password,
    );
    console.log("/register successful");
    await createUser({
      id: userCredential.user.uid,
      nickname: validationResult.data.nickname,
    });
    success = true;
  } catch (e) {
    const error = e as unknown as { code: string; message: string };
    if (error.code === "auth/email-already-in-use") {
      return {
        form,
        errors: {
          email: ["Цей email вже зареєстрований"],
        },
      };
    }
  }
  if (success) return redirect("/login");
  return {
    form,
    errors: {
      general: ["Помилка під час реєстрації"],
    },
  };
}
