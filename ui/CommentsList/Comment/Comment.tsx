import { cn } from "@/ui/classNames";

type CommentProps = React.ComponentProps<"li"> & {
  authorId?: string | undefined;
  authorNickname: string;
  createdAt: Date;
  content: string;
};

export function Comment({
  authorId,
  authorNickname,
  createdAt,
  content,
  ...props
}: CommentProps) {
  return (
    <li
      {...props}
      className={cn(
        "bg-gray-700 border border-gray-500 p-2 rounded",
        props.className,
      )}
    >
      <div className="flex gap-1 items-center">
        <p className="text-md">{authorNickname}</p>
        <p className="text-xs text-gray-400">{createdAt.toLocaleString()}</p>
      </div>

      <p>{content}</p>
    </li>
  );
}
