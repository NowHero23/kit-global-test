"use client";

import { Button } from "../Button";
import { cn } from "../classNames";
import { useActionState } from "react";
import { deletePostAction } from "@/app/actions/deletePostAction";

type DeletePostButtonProps = React.ComponentProps<"form"> & {
  slug: string;
  userId?: string;
};

export function DeletePostButton({
  slug,
  userId,
  ...props
}: DeletePostButtonProps) {
  const [state, action] = useActionState(deletePostAction, {});

  return (
    <form action={action} {...props} className={cn("", props.className)}>
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="userId" value={userId} />
      <Button
        type="submit"
        className="dark:bg-red-700 dark:hover:bg-red-900 dark:hover:text-white"
      >
        {props.children}
      </Button>
    </form>
  );
}
