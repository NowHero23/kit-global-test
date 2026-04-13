"use client";

import { useActionState } from "react";
import { Form } from "../Form/Form";
import { ValidatedInput } from "../ValidatedInput";
import { Button } from "../Button";
import { createCommentSchema } from "@/app/schemas/createCommentSchema";
import { createCommentAction } from "@/app/actions/createCommentAction";
import { ErrorList } from "../Form/ErrorList/ErrorList";

type CreateCommentProps = {
  postId: string;
  content?: string;
};

export function CreateCommentForm(props: CreateCommentProps) {
  const [state, action, isPending] = useActionState(createCommentAction, {});

  return (
    <Form
      action={action}
      actionState={state}
      schema={createCommentSchema}
      noValidate
    >
      <input type="hidden" name="postId" value={props.postId} />
      <div>
        {/* <FormLabel htmlFor="content">Comments:</FormLabel> */}
        <ValidatedInput
          maxLength={201}
          isMultiline={true}
          type="text"
          name="content"
          placeholder="Додайте свій коментар..."
          fieldSchema={createCommentSchema.shape["content"]}
          defaultValue={state.form?.content}
          errors={state.errors?.content}
        />
      </div>
      <ErrorList errors={state.errors?.general} />
      <div>
        <Button type="submit" disabled={isPending}>
          Send comment
        </Button>
      </div>
    </Form>
  );
}

export default CreateCommentForm;
