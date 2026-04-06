import Link from "next/link";
import { cx } from "../classNames";
import { JSX } from "react";
import { Button } from "../Button";
import { toUser } from "@/app/shared/user";
import { getTokens } from "next-firebase-auth-edge";
import { Metadata } from "@/app/auth/AuthContext";
import { cookies } from "next/headers";
import { authConfig } from "@/config/server-config";

type PostPreviewProps = {
  id?: string | undefined;
  title: string;
  description: string;
  content: string;
  authorId?: string | undefined;
  authorNickname?: string | undefined;
};

export async function PostPreview(
  props: JSX.IntrinsicElements["div"] & { post: PostPreviewProps },
) {
  const slicedDescriprion =
    props.post.description.length > 50
      ? props.post.description.slice(0, 50) + "..."
      : props.post.description;

  const tokens = await getTokens<Metadata>(await cookies(), authConfig);

  const user = tokens ? toUser(tokens) : null;

  const isAuthor = user?.uid === props.post.authorId;

  return (
    <div {...props} className={cx("", props.className)}>
      <Link href={`/blog/${props.post.id}`}>
        <h2 className="font-bold text-xl text-center">{props.post.title}</h2>
      </Link>

      <p>{slicedDescriprion}</p>

      <p className="text-sm dark:text-gray-300 mt-2">
        Author: {props.post.authorNickname}
      </p>

      <div className="flex gap-2 items-center mt-2">
        <Link href={`/blog/${props.post.id}`}>
          <Button className="px-4!"> Read more</Button>
        </Link>

        {isAuthor && (
          <Link href={`/blog/${props.post.id}/edit`}>
            <Button className="px-4! bg-transparent! hover:bg-indigo-900! hover:text-red-500">
              Edit
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
