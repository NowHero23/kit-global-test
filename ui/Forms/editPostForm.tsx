"use client";

import { useActionState, useState } from "react";
import { Form } from "@/ui/Form/Form";
import { FormLabel } from "@/ui/Form/FormLabel";
import { ValidatedInput } from "@/ui/ValidatedInput";
import { Button } from "@/ui/Button";
import Link from "next/link";
import { editPostAction } from "@/app/actions/editPostAction";
import { editPostSchema } from "@/app/schemas/editPostSchema";

type EditPostProps = {
  id?: string | undefined;
  title: string;
  description: string;
  content: string;
};

export function EditPostForm({ post }: { post: EditPostProps }) {
  const [wasSubmitted, setWasSubmitted] = useState(false);

  const [state, action, isPending] = useActionState(editPostAction, {});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setWasSubmitted(true);
    const formDataObj = new FormData(event.currentTarget);
    const data = Object.fromEntries(formDataObj);
    const validationResult = editPostSchema.safeParse(data);
    if (!validationResult.success) {
      event.preventDefault();
    }
  };

  return (
    <Form onSubmit={handleSubmit} action={action} noValidate>
      <input type="hidden" name="id" value={post?.id} />
      <div>
        <FormLabel htmlFor="title">Title:</FormLabel>
        <ValidatedInput
          fieldSchema={editPostSchema.shape["title"]}
          name="title"
          type="text"
          wasSubmitted={wasSubmitted}
          defaultValue={state.form?.title || post.title}
          errors={state.errors?.title}
          maxLength={501}
          isMultiline={true}
          placeholder="Enter post title"
        />
      </div>
      <div>
        <FormLabel htmlFor="description">Description:</FormLabel>
        <ValidatedInput
          fieldSchema={editPostSchema.shape["description"]}
          name="description"
          type="text"
          wasSubmitted={wasSubmitted}
          defaultValue={state.form?.description || post.description}
          errors={state.errors?.description}
          maxLength={501}
          isMultiline={true}
          placeholder="Enter post description"
        />
      </div>
      <div>
        <FormLabel htmlFor="content">Content:</FormLabel>
        <ValidatedInput
          fieldSchema={editPostSchema.shape["content"]}
          name="content"
          type="text"
          wasSubmitted={wasSubmitted}
          defaultValue={state.form?.content || post.content}
          errors={state.errors?.content}
          maxLength={50001}
          isMultiline={true}
          placeholder="Enter post content"
        />
      </div>
      <div className="flex items-center">
        <Button type="submit" disabled={isPending}>
          Save edits
        </Button>
        <Link
          href="/"
          className="ml-4 font-medium text-gray-600 hover:underline dark:text-gray-500"
        >
          <Button className="px-4! bg-red-700! hover:bg-red-900! hover:text-white!">
            Cancel
          </Button>
        </Link>
      </div>
    </Form>
  );
}
