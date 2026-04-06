import { Timestamp } from "firebase/firestore";
import User from "./user";

type BlogPost = {
  id?: string;
  title: string;
  description: string;
  content: string;
  author: User | null;
  createdAt: Timestamp;
};
export default BlogPost;
