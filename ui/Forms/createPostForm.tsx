"use client";

import { useActionState } from "react";
import { Form } from "../Form/Form";
import { FormLabel } from "../Form/FormLabel";
import { ValidatedInput } from "../ValidatedInput";
import { Button } from "../Button";
import { createPostSchema } from "@/app/schemas/createPostSchema";
import { createPostAction } from "@/app/actions/createPostAction";
import { ErrorList } from "../Form/ErrorList/ErrorList";
import { TagInput } from "../TagInput";

export function CreatePostForm() {
  const [state, action, isPending] = useActionState(createPostAction, {});

  return (
    <Form
      action={action}
      actionState={state}
      schema={createPostSchema}
      noValidate
    >
      <div>
        <FormLabel htmlFor="title">Title:</FormLabel>
        <ValidatedInput
          maxLength={121}
          isMultiline={true}
          type="text"
          name="title"
          placeholder="Enter post title"
          fieldSchema={createPostSchema.shape["title"]}
          defaultValue={state.form?.title}
          errors={state.errors?.title}
        />
      </div>
      <div>
        <FormLabel htmlFor="description">Description:</FormLabel>
        <ValidatedInput
          maxLength={501}
          isMultiline={true}
          type="text"
          name="description"
          placeholder="Enter post description"
          fieldSchema={createPostSchema.shape["description"]}
          defaultValue={state.form?.description}
          errors={state.errors?.description}
        />
      </div>
      <div>
        <FormLabel htmlFor="content">Content:</FormLabel>
        <ValidatedInput
          maxLength={50001}
          isMultiline={true}
          type="text"
          name="content"
          placeholder="Enter post content"
          fieldSchema={createPostSchema.shape["content"]}
          defaultValue={state.form?.content}
          errors={state.errors?.content}
        />
      </div>
      <div>
        <FormLabel htmlFor="tags">Tags (press Enter to add):</FormLabel>
        <TagInput
          name="tags"
          fieldSchema={createPostSchema.shape["tags"]}
          defaultValue={state.form?.tags}
          errors={state.errors?.tags}
        />
      </div>
      <ErrorList errors={state.errors?.general} />
      <div>
        <Button type="submit" disabled={isPending}>
          Create
        </Button>
      </div>
    </Form>
  );
}
