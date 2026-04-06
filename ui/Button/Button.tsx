import { cx } from "../classNames";
import { JSX } from "react";
export function Button(props: JSX.IntrinsicElements["button"]) {
  return (
    <button
      {...props}
      className={cx(
        "cursor-pointer w-full text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-primary-800",
        props.className,
      )}
    />
  );
}
