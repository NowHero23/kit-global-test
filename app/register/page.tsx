import Link from "next/link";
import { RegisterForm } from "@/ui/Forms/registerForm";
import { Panel } from "@/ui/Panel";

export default function Page() {
  return (
    <Panel>
      <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        Register page
      </h1>

      <RegisterForm />
      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        Already have an account?{" "}
        <Link
          className="font-medium text-gray-600 hover:underline dark:text-gray-500"
          href="/login"
        >
          Login here
        </Link>
      </p>
    </Panel>
  );
}
