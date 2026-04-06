"use server";

import { refreshCookiesWithIdToken } from "next-firebase-auth-edge/next/cookies";
import { signInWithEmailAndPassword } from "firebase/auth";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { authConfig } from "@/config/server-config";
import { getFirebaseAuth } from "@/app/firebase";
import { LoginActionState, loginSchema } from "@/app/schemas/loginSchema";

export async function loginAction(
  _prev: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const form = Object.fromEntries(formData);
  const validationResult = loginSchema.safeParse(form);
  if (!validationResult.success) {
    return {
      form,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }
  try {
    const credential = await signInWithEmailAndPassword(
      getFirebaseAuth(),
      validationResult.data.email,
      validationResult.data.password,
    );

    const idToken = await credential.user.getIdToken();

    await refreshCookiesWithIdToken(
      idToken,
      await headers(),
      await cookies(),
      authConfig,
    );
  } catch (error) {
    const firebaseError = error as unknown as { code: string; message: string };
    let errorMessage = "Помилка під час входу";

    if (firebaseError.code === "auth/user-not-found") {
      errorMessage = "Користувача з таким email не існує";
    } else if (firebaseError.code === "auth/wrong-password") {
      errorMessage = "Неправильний пароль";
    } else if (firebaseError.code === "auth/invalid-email") {
      errorMessage = "Невалідний формат email";
    } else if (firebaseError.code === "auth/too-many-requests") {
      errorMessage = "Занадто багато спроб входу. Спробуйте пізніше";
    }

    return {
      form,
      errors: {
        general: [errorMessage],
      },
    };
  }

  redirect("/");
}
