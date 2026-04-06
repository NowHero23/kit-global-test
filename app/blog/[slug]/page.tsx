import { Panel } from "@/ui/Panel";
import { getBlogPost } from "../firebase";
import Link from "next/link";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { authConfig } from "@/config/server-config";
import { toUser } from "@/app/shared/user";
import { Metadata } from "@/app/auth/AuthContext";
import { Button } from "@/ui/Button";
import { DeletePostButton } from "@/ui/DeletePostButton";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  const tokens = await getTokens<Metadata>(await cookies(), authConfig);

  const user = tokens ? toUser(tokens) : null;

  const isEdit =
    user?.uid === post?.author?.id ? (
      <div className="flex gap-1">
        <Link href={`${slug}/edit`}>
          <Button>Edit</Button>
        </Link>
        <DeletePostButton slug={slug} userId={user?.uid}>
          Delete post
        </DeletePostButton>
      </div>
    ) : (
      ""
    );


  return (
    <div className="flex flex-col gap-2 my-2 w-full max-w-lg">
      <h1 className="text-2xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        {post?.title}
      </h1>
      <Panel className="text-left">
        <div>
          <h3 className="font-bold">Description:</h3>
          <p>{post?.description}</p>
        </div>

        <p>Author: {post?.author?.nickname}</p>
        {isEdit}
      </Panel>
      <Panel>
        <p>{post?.content}</p>
      </Panel>
    </div>
  );
}
