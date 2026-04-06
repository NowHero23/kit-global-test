"use client";

import { cx } from "../classNames";
import { JSX } from "react";

export function Form(props: JSX.IntrinsicElements["form"]) {
  return (
    <form
      {...props}
      className={cx("space-y-4 md:space-y-6", props.className)}
    />
  );
}
