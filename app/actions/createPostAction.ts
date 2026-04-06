"use server";

import { getTokens } from "next-firebase-auth-edge";
import {
  CreateActionState,
  createPostSchema,
} from "../schemas/createPostSchema";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { authConfig } from "@/config/server-config";
import { Metadata } from "../auth/AuthContext";
import { toUser } from "../shared/user";
import { createBlogPost } from "../blog/firebase";

export async function createPostAction(
  _prev: CreateActionState,
  formData: FormData,
): Promise<CreateActionState> {
  const tokens = await getTokens<Metadata>(await cookies(), authConfig);

  const form = Object.fromEntries(formData);

  const user = tokens ? toUser(tokens) : null;
  if (user == null) {
    return { form, errors: { general: ["Unauthorized"] } };
  }

  const validationResult = createPostSchema.safeParse(form);
  if (!validationResult.success) {
    return {
      form,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const postId = await createBlogPost({
    authorId: user.uid,
    ...validationResult.data,
  });

  console.log("All Data:", {
    ...validationResult.data,
  });
  if (postId != null) {
    redirect(`/blog/${postId}`);
  }
  redirect("/");
}
