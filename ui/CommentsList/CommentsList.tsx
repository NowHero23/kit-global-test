import { getCommentsByPostId } from "@/app/blog/firebase";
import { cn } from "../classNames";
import { Comment } from "./Comment";

type CommentsListProps = React.ComponentPropsWithoutRef<"ul"> & {
  postId: string;
};

export async function CommentsList({ postId, ...props }: CommentsListProps) {
  const comments = await getCommentsByPostId(postId).then((comments) =>
    comments.map((comment) => (
      <Comment
        key={comment.id ?? comment.createdAt?.getTime() ?? "comment"}
        authorNickname={comment.authorNickname}
        content={comment.content}
        createdAt={comment.createdAt}
      />
    )),
  );

  return (
    <ul {...props} className={cn("flex flex-col gap-1", props.className)}>
      {comments}
    </ul>
  );
}
