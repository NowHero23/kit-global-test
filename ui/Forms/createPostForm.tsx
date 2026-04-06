"use client";

import { useActionState, useState } from "react";
import { Form } from "../Form/Form";
import { FormLabel } from "../Form/FormLabel";
import { ValidatedInput } from "../ValidatedInput";
import { Button } from "../Button";
import { createPostSchema } from "@/app/schemas/createPostSchema";
import { createPostAction } from "@/app/actions/createPostAction";

export function CreatePostForm() {
  const [wasSubmitted, setWasSubmitted] = useState(false);

  const [state, action, isPending] = useActionState(createPostAction, {});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setWasSubmitted(true);
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    const validationResult = createPostSchema.safeParse(data);
    if (!validationResult.success) {
      event.preventDefault();
    }
  };

  return (
    <Form onSubmit={handleSubmit} action={action} noValidate>
      <div>
        <FormLabel htmlFor="title">Title:</FormLabel>
        <ValidatedInput
          maxLength={121}
          isMultiline={true}
          type="text"
          name="title"
          placeholder="Enter post title"
          wasSubmitted={wasSubmitted}
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
          wasSubmitted={wasSubmitted}
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
          wasSubmitted={wasSubmitted}
          fieldSchema={createPostSchema.shape["content"]}
          defaultValue={state.form?.content}
          errors={state.errors?.content}
        />
      </div>
      <div>
        <Button type="submit" disabled={isPending}>
          Create
        </Button>
      </div>
    </Form>
  );
}

export default CreatePostForm;
