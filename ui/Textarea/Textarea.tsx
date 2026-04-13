import { cn } from "../classNames";

export function Textarea(props: React.ComponentProps<"textarea">) {
  return (
    <textarea
      {...props}
      className={cn(
        "bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm min-h-12 field-sizing-content resize-none rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
        props.className,
      )}
    />
  );
}
