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
import { CommentsList } from "@/ui/CommentsList";
import CreateCommentForm from "@/ui/Forms/createCommentForm";
import { TagsList } from "@/ui/TagsList";

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
    user?.uid === post?.authorId ? (
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

  const tags = post?.tags && <TagsList tags={post?.tags} />;

  return (
    <>
      <h1 className="wrap-break-word text-2xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        {post?.title}
      </h1>
      <Panel>
        <div>
          <h3 className="font-bold">Description:</h3>
          <p className="wrap-break-word">{post?.description}</p>
        </div>

        <div className="flex justify-between items-center">
          <p>Author: {post?.authorNickname}</p>
          <p className="text-xs text-gray-400">
            {post?.createdAt.toLocaleString()}
          </p>
        </div>
        {tags}
        {isEdit}
      </Panel>
      <Panel>
        <p>{post?.content}</p>
      </Panel>

      <Panel>
        <h3 className="font-bold">Comments:</h3>

        {/* Тут буде компонент для коментарів */}
        {/* <Textarea placeholder="Додайте свій коментар..." /> */}

        {user != null && <CreateCommentForm postId={slug} />}

        <CommentsList postId={slug} />
      </Panel>
    </>
  );
}
