"use client";

import { useActionState } from "react";
import { Form } from "../Form";
import { FormLabel } from "../Form/FormLabel";
import { ValidatedInput } from "../ValidatedInput";
import { Button } from "../Button";
import { loginSchema } from "@/app/schemas/loginSchema";
import { loginAction } from "@/app/actions/loginAction";

export function LoginForm() {
  const [state, action, isPending] = useActionState(loginAction, {});

  return (
    <Form action={action} actionState={state} schema={loginSchema} noValidate>
      <div>
        <FormLabel htmlFor="email">Email:</FormLabel>
        <ValidatedInput
          type="email"
          name="email"
          placeholder="name@company.com"
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
