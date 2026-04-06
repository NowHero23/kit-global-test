import { cx } from "../../classNames";
import { JSX } from "react";
export function FormLabel(props: JSX.IntrinsicElements["label"]) {
  return (
    <label
      {...props}
      className={cx(
        "block mb-2 text-md font-medium text-gray-900 dark:text-white",
        props.className,
      )}
    />
  );
}
