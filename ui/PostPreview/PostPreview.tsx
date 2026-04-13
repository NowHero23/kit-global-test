import Link from "next/link";
import { cn } from "../classNames";
import { Button } from "../Button";
import { TagsList } from "../TagsList";
import Tag from "@/app/types/tag";

type PostPreviewProps = React.ComponentProps<"div"> & {
  id?: string | undefined;
  title: string;
  description: string;
  content: string;
  authorId?: string | undefined;
  authorNickname?: string;
  createdAt: Date;
  tags?: Tag[];
  userId: string | undefined;
};

export async function PostPreview({
  authorId,
  authorNickname,
  createdAt,
  userId,
  ...props
}: PostPreviewProps) {
  const slicedDescriprion =
    props.description.length > 50
      ? props.description.slice(0, 50) + "..."
      : props.description;

  const isAuthor = userId === authorId;

  const tags = props?.tags && <TagsList tags={props?.tags} />;

  return (
    <div {...props} className={cn("", props.className)}>
      <Link href={`/blog/${props.id}`}>
        <h2 className="font-bold text-xl text-center text-wrap wrap-break-word">
          {props.title}
        </h2>
      </Link>

      <p className="text-wrap wrap-break-word">{slicedDescriprion}</p>

      <div className="flex justify-between items-center">
        <p className="text-sm dark:text-gray-300 mt-2 text-wrap">
          Author: {authorNickname}
        </p>
        <p className="text-xs text-gray-400">{createdAt.toLocaleString()}</p>
      </div>
      {tags}
      <div className="flex gap-2 items-center mt-2">
        <Link href={`/blog/${props.id}`}>
          <Button className="px-4!"> Read more</Button>
        </Link>

        {isAuthor && (
          <Link href={`/blog/${props.id}/edit`}>
            <Button className="px-4! bg-transparent! hover:bg-indigo-900! hover:text-red-500">
              Edit
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
