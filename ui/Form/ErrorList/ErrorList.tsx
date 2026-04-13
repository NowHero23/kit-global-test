"use client";

import { cn } from "@/ui/classNames";

type ErrorListProps = React.ComponentProps<"ul"> & {
  errors?: string[];
};

export function ErrorList(props: ErrorListProps) {
  const fieldErrors = props.errors || [];
  if (fieldErrors.length === 0) {
    return null;
  }
  return (
    <ul
      {...props}
      className={cn(
        "text-sm text-red-500 mt-1 list-disc list-inside",
        props.className,
      )}
    >
      {fieldErrors.map((e) => (
        <li key={e}>{e}</li>
      ))}
    </ul>
  );
}
