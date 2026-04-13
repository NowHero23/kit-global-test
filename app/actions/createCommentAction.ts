"use server";

import { getTokens } from "next-firebase-auth-edge";
import {
  CreateCommentActionState,
  createCommentSchema,
} from "../schemas/createCommentSchema";
import { Metadata } from "../auth/AuthContext";
import { cookies } from "next/headers";
import { authConfig } from "@/config/server-config";
import { toUser } from "../shared/user";
import { redirect } from "next/navigation";
import { createComment } from "@/app/blog/firebase";

export async function createCommentAction(
  _prev: CreateCommentActionState,
  formData: FormData,
): Promise<CreateCommentActionState> {
  const tokens = await getTokens<Metadata>(await cookies(), authConfig);

  const form = Object.fromEntries(formData);

  const user = tokens ? toUser(tokens) : null;
  if (user == null) {
    return { form, errors: { general: ["Unauthorized"] } };
  }

  const validationResult = createCommentSchema.safeParse(form);
  if (!validationResult.success) {
    return {
      form,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }
  console.log("Validation successful:", validationResult.data);
  const { postId, ...commentData } = validationResult.data;

  const commentId = await createComment({
    postId,
    authorId: user.uid,
    authorNickname:
      user.metadata?.nickname ||
      user.displayName ||
      user.email?.split("@")[0] ||
      "Anonymous",
    content: commentData.content,
  });

  if (!commentId) {
    return {
      form: validationResult.data,
      errors: { general: ["Не вдалося додати коментар. Спробуйте пізніше."] },
    };
  }

  redirect(`/blog/${postId}`);
}
