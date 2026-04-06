"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authConfig } from "@/config/server-config";
import {
  DeletePostActionState,
  deletePostSchema,
} from "../schemas/deletePostSchema";
import { getTokens } from "next-firebase-auth-edge";
import { Metadata } from "../auth/AuthContext";
import { toUser } from "../shared/user";
import { deleteBlogPost } from "../blog/firebase";

export async function deletePostAction(
  _prev: DeletePostActionState,
  formData: FormData,
): Promise<DeletePostActionState> {
  const tokens = await getTokens<Metadata>(await cookies(), authConfig);

  const form = Object.fromEntries(formData);

  const user = tokens ? toUser(tokens) : null;
  if (user == null) {
    return { form, errors: { userId: ["Unauthorized"] } };
  }

  const validationResult = deletePostSchema.safeParse(form);
  if (!validationResult.success) {
    return {
      form,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  await deleteBlogPost(validationResult.data.slug);
  redirect("/");
}
