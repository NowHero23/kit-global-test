import { CreatePostForm } from "@/ui/Forms/createPostForm";
import { Panel } from "@/ui/Panel";
import Link from "next/link";

export default async function Page() {
  return (
    <Panel>
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        Create Blog Post
      </h1>

      <CreatePostForm />
      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        No post?{" "}
        <Link
          className="font-medium text-gray-600 hover:underline dark:text-gray-500"
          href="/"
        >
          Go back to Home
        </Link>
      </p>
    </Panel>
  );
}
