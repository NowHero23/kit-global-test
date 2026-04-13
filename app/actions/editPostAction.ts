"use server";

import { getTokens } from "next-firebase-auth-edge";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { authConfig } from "@/config/server-config";
import { Metadata } from "../auth/AuthContext";
import { toUser } from "../shared/user";
import { getBlogAuthorId, updateBlogPost } from "../blog/firebase";
import { EditPostActionState, editPostSchema } from "../schemas/editPostSchema";

export async function editPostAction(
  _prev: EditPostActionState,
  formData: FormData,
): Promise<EditPostActionState> {
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

  const validationResult = editPostSchema.safeParse(formRaw);
  if (!validationResult.success) {
    return {
      form: formForState,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { id, ...postData } = validationResult.data;

  const authorId = await getBlogAuthorId(id);

  if (authorId !== user.uid) {
    return { form: formForState, errors: { general: ["Forbidden"] } };
  }

  await updateBlogPost(id, {
    authorId,
    ...postData
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
