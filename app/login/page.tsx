import Link from "next/link";
import { Panel } from "@/ui/Panel/Panel";
import { LoginForm } from "@/ui/Forms/loginForm";

export default function Page() {
  return (
    <Panel>
      <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        Login page
      </h1>

      <LoginForm />

      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        Don&apos;t have an account?{" "}
        <Link
          className="font-medium text-gray-600 hover:underline dark:text-gray-500"
          href="/register"
        >
          Register here
        </Link>
      </p>
    </Panel>
  );
}
