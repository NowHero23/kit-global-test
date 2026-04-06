"use client";

import { useActionState, useState } from "react";
import { Form } from "../Form/Form";
import { FormLabel } from "../Form/FormLabel";
import { ValidatedInput } from "../ValidatedInput";
import { Button } from "../Button";
import { registerSchema } from "@/app/schemas/registerSchema";
import { RegisterAction } from "@/app/actions/registerAction";

export function RegisterForm() {
  const [wasSubmitted, setWasSubmitted] = useState(false);

  const [state, action, isPending] = useActionState(RegisterAction, {});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setWasSubmitted(true);
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    const validationResult = registerSchema.safeParse(data);
    if (!validationResult.success) {
      event.preventDefault();
    }
  };

  return (
    <Form onSubmit={handleSubmit} action={action} noValidate>
      <div>
        <FormLabel htmlFor="email">Email:</FormLabel>
        <ValidatedInput
          type="email"
          name="email"
          placeholder="name@company.com"
          wasSubmitted={wasSubmitted}
          fieldSchema={registerSchema.shape["email"]}
          defaultValue={state.form?.email}
          errors={state.errors?.email}
        />
      </div>
      <div>
        <FormLabel htmlFor="password">Password:</FormLabel>
        <ValidatedInput
          type="password"
          name="password"
          placeholder="••••••••"
          fieldSchema={registerSchema.shape["password"]}
          wasSubmitted={wasSubmitted}
          defaultValue={state.form?.password}
          errors={state.errors?.password}
        />
      </div>
      <div>
        <FormLabel htmlFor="confirmPassword">Confirm password:</FormLabel>
        <ValidatedInput
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          fieldSchema={registerSchema.shape["confirmPassword"]}
          wasSubmitted={wasSubmitted}
          defaultValue={state.form?.confirmPassword}
          errors={state.errors?.confirmPassword}
        />
      </div>
      <div>
        <FormLabel htmlFor="nickname">Nickname:</FormLabel>
        <ValidatedInput
          type="text"
          name="nickname"
          placeholder="Nickname"
          fieldSchema={registerSchema.shape["nickname"]}
          wasSubmitted={wasSubmitted}
          defaultValue={state.form?.nickname}
          errors={state.errors?.nickname}
        />
      </div>
      <div>
        <Button type="submit" disabled={isPending}>
          Submit
        </Button>
      </div>
    </Form>
  );
}
