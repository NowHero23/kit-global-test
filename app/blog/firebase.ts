import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { getFirebaseApp } from "../firebase";
import BlogPost from "../types/blogPost";
import User from "../types/user";

const db = getFirestore(getFirebaseApp());

const createBlogPost = async (data: {
  authorId: string;
  title: string;
  content: string;
  description: string;
}): Promise<string | null> => {
  try {
    const authorsRef = doc(db, "users", data.authorId);

    const docRef = await addDoc(collection(db, "blogPosts"), {
      title: data.title,
      description: data.description,
      content: data.content,
      author: authorsRef,
      createdAt: new Date(),
    });
    console.log("Пост успішно створено!");
    return docRef.id;
  } catch (error) {
    console.error("Error creating blog post:", error);
  }
  return null;
};

const getBlogPost: (postId: string) => Promise<BlogPost | null> = async (
  postId: string,
) => {
  const postRef = doc(db, "blogPosts", postId);
  const postSnap = await getDoc(postRef);

  if (postSnap.exists()) {
    const postData = postSnap.data();

    const authorSnap = await getDoc(postData.author);
    let authorData: User | null = null;

    if (authorSnap.exists()) {
      authorData = {
        id: authorSnap.id,
        ...(authorSnap.data() as User),
      } as User;
    }

    return {
      id: postSnap.id,
      ...(postData as Omit<BlogPost, "author">),
      author: authorData,
    } as BlogPost;
  } else {
    console.log("Пост не знайдено!");
  }
  return null;
};

const updateBlogPost = async (
  postId: string,
  data: {
    authorId: string;
    title: string;
    content: string;
    description: string;
  },
) => {
  const authorsRef = doc(db, "users", data.authorId);
  const postRef = doc(db, "blogPosts", postId);
  const result = await updateDoc(postRef, { ...data, author: authorsRef });
  console.log("Пост успішно оновлено!", result);
};

const getBlogPosts = async (): Promise<BlogPost[]> => {
  const blogPostsRef = collection(db, "blogPosts");
  const blogPostsSnap = await getDocs(blogPostsRef);

  const posts = await Promise.all(
    blogPostsSnap.docs.map(async (doc) => {
      const postData = doc.data();

      const authorSnap = await getDoc(postData.author);
      let authorData: User | null = null;

      if (authorSnap.exists()) {
        authorData = {
          id: authorSnap.id,
          ...(authorSnap.data() as User),
        } as User;
      }

      return {
        id: doc.id,
        ...(postData as Omit<BlogPost, "author">),
        author: authorData,
      } as BlogPost;
    }),
  );

  return posts;
};

const getBlogAuthorId = async (postId: string): Promise<string | null> => {
  const postRef = doc(db, "blogPosts", postId);
  const postSnap = await getDoc(postRef);

  if (postSnap.exists()) {
    const postData = postSnap.data();
    return postData.author.id;
  }
  return null;
};

const deleteBlogPost = async (postId: string) => {
  await deleteDoc(doc(db, "blogPosts", postId));
};

export {
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  getBlogPosts,
  getBlogAuthorId,
  deleteBlogPost,
};
