import { cn } from "@/ui/classNames";

export function FormLabel(props: React.ComponentProps<"label">) {
  return (
    <label
      {...props}
      className={cn(
        "block mb-2 text-md font-medium text-gray-900 dark:text-white",
        props.className,
      )}
    />
  );
}
