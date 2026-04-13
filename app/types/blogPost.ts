import Tag from "./tag";

type BlogPost = {
  id?: string;
  title: string;
  description: string;
  content: string;
  authorId: string;
  authorNickname: string;
  createdAt: Date;
  tags: Tag[];
};
export default BlogPost;
