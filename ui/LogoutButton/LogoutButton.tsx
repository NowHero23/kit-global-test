import { Button } from "../Button";
import { cn } from "../classNames";
import { logoutAction } from "@/app/actions/logoutAction";

export function LogoutButton(props: React.ComponentProps<"form">) {
  return (
    <form action={logoutAction} {...props} className={cn("", props.className)}>
      <Button type="submit">Sign out</Button>
    </form>
  );
}
