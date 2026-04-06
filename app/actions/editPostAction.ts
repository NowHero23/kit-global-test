"use server";

import { getTokens } from "next-firebase-auth-edge";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { authConfig } from "@/config/server-config";
import { Metadata } from "../auth/AuthContext";
import { toUser } from "../shared/user";
import { updateBlogPost } from "../blog/firebase";
import { EditActionState, editPostSchema } from "../schemas/editPostSchema";

export async function editPostAction(
  _prev: EditActionState,
  formData: FormData,
): Promise<EditActionState> {
  const tokens = await getTokens<Metadata>(await cookies(), authConfig);

  const form = Object.fromEntries(formData);

  const user = tokens ? toUser(tokens) : null;
  if (user == null) {
    return { form, errors: { general: ["Unauthorized"] } };
  }

  const validationResult = editPostSchema.safeParse(form);
  if (!validationResult.success) {
    return {
      form,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { id, ...postData } = validationResult.data;

  await updateBlogPost(id, {
    authorId: user.uid,
    title: postData.title,
    content: postData.content,
    description: postData.description,
  });

  console.log("All Data:", {
    id,
    ...postData,
  });
  if (id) {
    redirect(`/blog/${id}`);
  }
  redirect("/");
}
