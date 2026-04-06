"use client";

import { Button } from "../Button";
import { cx } from "../classNames";
import { JSX, useActionState } from "react";
import { deletePostAction } from "@/app/actions/deletePostAction";

export function DeletePostButton({
  slug,
  userId,
  ...props
}: JSX.IntrinsicElements["form"] & { slug: string; userId?: string }) {
  const [state, action] = useActionState(deletePostAction, {});

  return (
    <form action={action} {...props} className={cx("", props.className)}>
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="userId" value={userId} />
      <Button type="submit">{props.children}</Button>
    </form>
  );
}
