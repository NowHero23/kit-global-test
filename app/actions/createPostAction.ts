"use server";

import { getTokens } from "next-firebase-auth-edge";
import {
  CreatePostActionState,
  createPostSchema,
} from "../schemas/createPostSchema";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { authConfig } from "@/config/server-config";
import { Metadata } from "../auth/AuthContext";
import { toUser } from "../shared/user";
import { createBlogPost } from "../blog/firebase";

export async function createPostAction(
  _prev: CreatePostActionState,
  formData: FormData,
): Promise<CreatePostActionState> {
  const tokens = await getTokens<Metadata>(await cookies(), authConfig);

  const formRaw = Object.fromEntries(formData);

  const user = tokens ? toUser(tokens) : null;

  const formForState = {
    ...formRaw,
    tags:
      typeof formRaw.tags === "string"
        ? formRaw.tags.split(",").filter(Boolean)
        : [],
  } as any;

  if (user == null) {
    return { form: formForState, errors: { general: ["Unauthorized"] } };
  }

  const validationResult = createPostSchema.safeParse(formRaw);
  if (!validationResult.success) {
    return {
      form: formForState,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const postId = await createBlogPost({
    authorId: user.uid,
    authorNickname: user.metadata.nickname,
    ...validationResult.data,
  });

  if (postId != null) {
    redirect(`/blog/${postId}`);
  }

  return { form: formForState, errors: { general: ["Failed to create post"] } };
}
