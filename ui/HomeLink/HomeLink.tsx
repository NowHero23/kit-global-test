import { cx } from "../classNames";
import { JSX } from "react";
import Link from "next/link";
export function HomeLink(props: JSX.IntrinsicElements["a"]) {
  return (
    <Link
      href="/"
      {...props}
      className={cx("text-xl font-bold dark:text-white", props.className)}
    >
      Kit app
    </Link>
  );
}
