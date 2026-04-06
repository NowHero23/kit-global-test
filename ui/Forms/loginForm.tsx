"use client";

import { useActionState, useState } from "react";
import { Form } from "../Form/Form";
import { FormLabel } from "../Form/FormLabel";
import { ValidatedInput } from "../ValidatedInput";
import { Button } from "../Button";
import { loginSchema } from "@/app/schemas/loginSchema";
import { loginAction } from "@/app/actions/loginAction";

export function LoginForm() {
  const [wasSubmitted, setWasSubmitted] = useState(false);

  const [state, action, isPending] = useActionState(loginAction, {});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setWasSubmitted(true);
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    const validationResult = loginSchema.safeParse(data);
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
          fieldSchema={loginSchema.shape["email"]}
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
          fieldSchema={loginSchema.shape["password"]}
          wasSubmitted={wasSubmitted}
          defaultValue={state.form?.password}
          errors={state.errors?.password}
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
