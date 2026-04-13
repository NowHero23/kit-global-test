import { cn } from "../classNames";

export function Panel(props: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        // "flex flex-col items-center justify-center h-full p-4",
        "text-left w-full bg-white rounded-lg shadow dark:border xl:p-0 dark:bg-gray-800 dark:border-gray-700 px-2 md:px-0",

        props.className,
      )}
    >
      <div className="space-y-4 md:space-y-6 p-3 md:p-8 ">{props.children}</div>
    </div>
  );
}
