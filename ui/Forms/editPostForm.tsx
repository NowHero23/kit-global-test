"use client";

import { useActionState } from "react";
import { Form } from "@/ui/Form/Form";
import { FormLabel } from "@/ui/Form/FormLabel";
import { ValidatedInput } from "@/ui/ValidatedInput";
import { Button } from "@/ui/Button";
import Link from "next/link";
import { editPostAction } from "@/app/actions/editPostAction";
import { editPostSchema } from "@/app/schemas/editPostSchema";
import { TagInput } from "../TagInput";

type EditPostProps = {
  id?: string | undefined;
  title: string;
  description: string;
  content: string;
  tags: string[];
};

export function EditPostForm(props: EditPostProps) {
  const [state, action, isPending] = useActionState(editPostAction, {});

  return (
    <Form
      action={action}
      actionState={state}
      schema={editPostSchema}
      noValidate
    >
      <input type="hidden" name="id" value={props?.id} />
      <div>
        <FormLabel htmlFor="title">Title:</FormLabel>
        <ValidatedInput
          fieldSchema={editPostSchema.shape["title"]}
          name="title"
          type="text"
          defaultValue={state.form?.title || props.title}
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
          defaultValue={state.form?.description || props.description}
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
          defaultValue={state.form?.content || props.content}
          errors={state.errors?.content}
          maxLength={50001}
          isMultiline={true}
          placeholder="Enter post content"
        />
      </div>
      <div>
        <FormLabel htmlFor="tags">Tags (press Enter to add):</FormLabel>
        <TagInput
          name="tags"
          fieldSchema={editPostSchema.shape["tags"]}
          defaultValue={state.form?.tags || props.tags}
          errors={state.errors?.tags}
        />
      </div>
      <div className="flex items-center">
        <Button type="submit" disabled={isPending}>
          Save edits
        </Button>
        <Link
          href={`/blog/${props?.id}`}
          className="ml-4 font-medium text-gray-600 hover:underline dark:text-gray-500"
        >
          <Button className="px-4 bg-red-700 hover:bg-red-900 hover:text-white dark:bg-red-700 dark:hover:bg-red-900 dark:hover:text-white">
            Cancel
          </Button>
        </Link>
      </div>
    </Form>
  );
}
