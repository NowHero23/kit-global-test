import { Panel } from "@/ui/Panel";
import { getBlogPost } from "../../firebase";
import Link from "next/link";
import { EditPostForm } from "@/ui/Forms/editPostForm";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return (
      <Panel>
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Post not found
        </h1>
      </Panel>
    );
  }

  const postTags = post.tags?.map((tag) => tag.id) || [];

  return (
    <Panel>
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        Edit Blog Post
      </h1>

      <EditPostForm
        id={post.id}
        title={post.title}
        description={post.description}
        content={post.content}
        tags={postTags || []}
      />
      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        Dont edit?{" "}
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
