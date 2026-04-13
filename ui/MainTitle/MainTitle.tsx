import { cn } from "../classNames";

export function MainTitle(props: React.ComponentProps<"h1">) {
  return (
    <h1
      {...props}
      className={cn(
        "text-2xl md:text-3xl lg:text-4xl my-2 font-semibold leading-tight tracking-tight text-gray-900 dark:text-white",
        props.className,
      )}
    />
  );
}
