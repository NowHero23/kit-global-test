import { cn } from "../classNames";
import Link from "next/link";

export function HomeLink(props: React.ComponentProps<"a">) {
  return (
    <Link
      href="/"
      {...props}
      className={cn("text-xl font-bold dark:text-white", props.className)}
    >
      Kit app
    </Link>
  );
}
