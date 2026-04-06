import { Button } from "../Button";
import { cx } from "../classNames";
import { JSX } from "react";

import { logoutAction } from "@/app/actions/logoutAction";

export function LogoutButton(props: JSX.IntrinsicElements["form"]) {
  return (
    <form action={logoutAction} {...props} className={cx("", props.className)}>
      <Button type="submit">Sign out</Button>
    </form>
  );
}
