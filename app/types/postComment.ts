type PostComment = {
  id?: string;
  postId: string;
  authorId: string;
  authorNickname: string;
  content: string;
  parentCommentId?: string | null;
  depth?: number;
  createdAt: Date;
};
export default PostComment;
