import { Panel } from "@/ui/Panel/Panel";
import { PostPreview } from "@/ui/PostPreview";
import { getAllTags, getBlogPosts } from "@/app/blog/firebase";
import { TagFilter } from "../TagFilter";
import { LoadMorePosts } from "./LoadMorePosts";
import Link from "next/link";
import { getTokens } from "next-firebase-auth-edge";
import { Metadata } from "@/app/auth/AuthContext";
import { cookies } from "next/headers";
import { authConfig } from "@/config/server-config";
import { toUser } from "@/app/shared/user";

export async function BlogList({
  searchParams,
}: {
  searchParams: { tags?: string; lastId?: string };
}) {
  const activeTags = searchParams?.tags ? searchParams.tags.split(",") : [];
  const startAfterId = searchParams?.lastId || null;

  const postsData = await getBlogPosts(10, startAfterId, activeTags);
  const { posts, lastId } = postsData;

  const tokens = await getTokens<Metadata>(await cookies(), authConfig);
  const user = tokens ? toUser(tokens) : null;

  // Для серверної пагінації (Назад/Вперед) нам потрібна логіка URL
  const createPageUrl = (newLastId: string | null) => {
    const params = new URLSearchParams();
    if (activeTags.length > 0) params.set("tags", activeTags.join(","));
    if (newLastId) params.set("lastId", newLastId);
    return `?${params.toString()}`;
  };

  return (
    <div className="flex flex-col items-center w-full">
      <TagFilter />

      <div className="flex flex-col gap-2 w-full">
        {posts.map((post) => (
          <Panel key={post.id}>
            <PostPreview {...post} userId={user?.uid} />
          </Panel>
        ))}
      </div>

      {/* Клієнтська частина для дозавантаження */}
      <LoadMorePosts
        initialLastId={lastId}
        activeTags={activeTags}
        userId={user?.uid}
      />

      {/* Серверна пагінація */}
      <div className="flex gap-4 mt-8 border-t pt-4 w-full justify-between">
        <Link
          href={createPageUrl(null)} // Спрощено: повернення на початок
          className="text-blue-500 hover:underline"
        >
          ← На першу сторінку
        </Link>

        {lastId && (
          <Link
            href={createPageUrl(lastId)}
            className="bg-gray-200 dark:bg-gray-800 px-4 py-2 rounded"
          >
            Наступна сторінка →
          </Link>
        )}
      </div>
    </div>
  );
}
