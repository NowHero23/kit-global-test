import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
  writeBatch,
  increment,
  WriteBatch,
  where,
} from "firebase/firestore";
import { getFirebaseApp } from "../firebase";
import BlogPost from "../types/blogPost";
import PostComment from "../types/postComment";
import { toDate } from "../shared/utils";
import Tag from "../types/tag";

const db = getFirestore(getFirebaseApp());

// Допоміжна функція для обробки тегів у батчі
const syncTags = (
  batch: WriteBatch,
  added: Tag[] = [],
  removed: Tag[] = [], // Видаляємо за ID (назвою тега)
) => {
  added.forEach((tag) => {
    if (!tag.id) return;
    const normalizedId = tag.id.toLowerCase();
    const tagRef = doc(db, "tags", normalizedId);

    batch.set(
      tagRef,
      {
        id: normalizedId, // Зберігаємо id всередині документа для зручності
        count: increment(1),
      },
      { merge: true },
    );
  });

  removed.forEach((tag) => {
    if (!tag.id) return;
    const normalizedId = tag.id.toLowerCase();
    const tagRef = doc(db, "tags", normalizedId);
    batch.update(tagRef, { count: increment(-1) });
  });
};

const createBlogPost = async (data: {
  authorId: string;
  authorNickname: string;
  title: string;
  content: string;
  description: string;
  tags?: Tag[];
}) => {
  try {
    const batch = writeBatch(db);

    // 1. Створюємо референс для нового поста (щоб отримати ID заздалегідь)
    const postRef = doc(collection(db, "blogPosts"));

    const postData = {
      title: data.title,
      description: data.description,
      content: data.content,
      authorNickname: data.authorNickname,
      authorId: data.authorId,
      tags: data.tags || [],
      createdAt: new Date(),
    } as BlogPost;

    // 2. Додаємо створення поста в батч
    batch.set(postRef, postData);

    // 3. Оновлюємо колекцію тегів
    syncTags(batch, data.tags, []);

    // 4. Комітимо всі зміни
    await batch.commit();

    console.log("The post and tags have been successfully saved!");
  } catch (error) {
    console.error("Error creating blog post:", error);
  }
};

const getBlogPost = async (postId: string) => {
  try {
    const postRef = doc(db, "blogPosts", postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) throw new Error("Post not found!");

    const postData = postSnap.data();

    return {
      id: postSnap.id,
      ...postData,
      createdAt: toDate(postData.createdAt) ?? new Date(0),
    } as BlogPost;
  } catch (error) {
    console.error("Error fetching post:", error);
  }
};

const updateBlogPost = async (
  postId: string,
  data: {
    title: string;
    content: string;
    description: string;
    authorId: string;
    tags?: Tag[];
  },
) => {
  try {
    const postRef = doc(db, "blogPosts", postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) throw new Error("Post not found");
    if (postSnap.data().authorId !== data.authorId)
      throw new Error("Forbidden");

    const oldTags: Tag[] = postSnap.data().tags || [];
    const newTags: Tag[] = data.tags || [];

    const batch = writeBatch(db);

    // Теги, які додали (є в нових, немає в старих)
    const added = newTags.filter((t) => !oldTags.includes(t));
    // Теги, які видалили (були в старих, немає в нових)
    const removed = oldTags.filter((t) => !newTags.includes(t));

    // Оновлюємо сам пост
    batch.update(postRef, { ...data });

    syncTags(batch, added, removed);

    await batch.commit();
    console.log("The post and tags have been successfully updated!");
  } catch (error) {
    console.error("Error updating post:", error);
  }
};

const getBlogPosts = async (
  pageSize: number = 10,
  lastDocId?: string | null,
  tags?: string[],
) => {
  try {
    const blogPostsRef = collection(db, "blogPosts");

    // Створюємо запит: сортуємо за датою (спадання)
    let q = query(blogPostsRef, orderBy("createdAt", "desc"));

    if (tags && tags.length > 0) {
      const tagObjects = tags.map((t) => ({ id: t }));
      q = query(q, where("tags", "array-contains-any", tagObjects));
    }

    // Якщо це не перша сторінка, починаємо після останнього документа
    if (lastDocId) {
      const lastDocSnap = await getDoc(doc(db, "blogPosts", lastDocId));
      if (lastDocSnap.exists()) {
        q = query(q, startAfter(lastDocSnap));
      }
    }

    q = query(q, limit(pageSize));

    const querySnapshot = await getDocs(q);

    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: toDate(doc.data().createdAt) ?? new Date(0),
    })) as BlogPost[];

    return {
      posts,
      lastId: querySnapshot.docs[querySnapshot.docs.length - 1]?.id || null,
    };
  } catch (error) {
    console.error("Error fetching Blog posts:", error);
    return {
      posts: [],
      lastId: null,
    };
  }
};

// Додамо функцію для отримання списку всіх тегів для вашого TagInput
const getAllTags = async () => {
  try {
    const tagsRef = collection(db, "tags");
    const q = query(tagsRef, orderBy("count", "desc"), limit(100));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Tag[];
  } catch (error) {
    console.error("Error fetching tags:", error);
  }
};
const getBlogAuthorId = async (postId: string) => {
  try {
    const postRef = doc(db, "blogPosts", postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) throw new Error("Post not found!");

    const postData = postSnap.data();
    return postData.authorId;
  } catch (error) {
    console.error("Error while deleting a post:", error);
  }
};

const deleteBlogPost = async (postId: string) => {
  try {
    const postRef = doc(db, "blogPosts", postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists())
      throw new Error("The post has been deleted or does not exist");

    const postTags: Tag[] = postSnap.data().tags || [];
    const batch = writeBatch(db);

    // Віднімаємо лічильники тегів
    syncTags(batch, [], postTags);

    // Отримуємо всі документи з підколекції "comments"
    const commentsRef = collection(db, "blogPosts", postId, "comments");
    const commentsSnapshot = await getDocs(commentsRef);

    // Додаємо кожен коментар до черги на видалення
    commentsSnapshot.forEach((commentDoc) => {
      batch.delete(commentDoc.ref);
    });

    // Додаємо сам пост до черги
    batch.delete(postRef);

    // Виконуємо всі операції одним запитом
    await batch.commit();
    console.log(
      "Posts, comments, and tag counts have been successfully deleted/updated",
    );
  } catch (error) {
    console.error("Error while deleting a post:", error);
  }
};

const createComment = async (data: {
  postId: string;
  authorId: string;
  authorNickname: string;
  content: string;
  parentCommentId?: string | null;
  depth?: number;
}) => {
  try {
    const postRef = doc(db, "blogPosts", data.postId);
    const commentsRef = collection(postRef, "comments");

    const commentId = (
      await addDoc(commentsRef, {
        postId: data.postId,
        authorId: data.authorId,
        authorNickname: data.authorNickname,
        content: data.content,
        createdAt: new Date(),
        parentCommentId: data.parentCommentId || null,
        depth: data.depth || 0,
      })
    ).id;

    console.log("The comment has been successfully posted!");
    return commentId;
  } catch (error) {
    console.error("Error creating comment:", error);
  }
};

const getCommentsByPostId = async (postId: string) => {
  try {
    const blogPostsRef = doc(db, "blogPosts", postId);
    const commentsRef = collection(blogPostsRef, "comments");

    const q = query(commentsRef, orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        ...data,
        createdAt: toDate(data.createdAt),
      } as PostComment;
    });
  } catch (error) {
    console.error("Error fetching Comments By PostId:", error);
  }
};

export {
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  getBlogPosts,
  getBlogAuthorId,
  deleteBlogPost,
  createComment,
  getCommentsByPostId,
  getAllTags,
};
