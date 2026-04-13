"use client";

import { useState, useEffect } from "react";
import { getBlogPosts } from "@/app/blog/firebase";
import BlogPost from "@/app/types/blogPost";
import { PostPreview } from "@/ui/PostPreview";
import { Panel } from "@/ui/Panel";
import { Button } from "@/ui/Button";

export function LoadMorePosts({
  initialLastId,
  activeTags,
  userId,
}: {
  initialLastId: string | null;
  activeTags: string[];
  userId: string | undefined;
}) {
  const [extraPosts, setExtraPosts] = useState<BlogPost[]>([]);
  const [currentLastId, setCurrentLastId] = useState<string | null>(
    initialLastId,
  );
  const [loading, setLoading] = useState(false);

  // Скидаємо список, якщо змінили фільтри (прийшли нові пропси від сервера)
  useEffect(() => {
    setExtraPosts([]);
    setCurrentLastId(initialLastId);
  }, [initialLastId, activeTags]);

  const handleLoadMore = async () => {
    if (!currentLastId || loading) return;
    setLoading(true);

    const result = await getBlogPosts(10, currentLastId, activeTags);
    setExtraPosts((prev) => [...prev, ...result.posts]);
    setCurrentLastId(result.lastId);
    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-col gap-2 w-full">
        {extraPosts.map((post) => (
          <Panel key={post.id}>
            <PostPreview {...post} userId={userId} />
          </Panel>
        ))}
      </div>

      {currentLastId && (
        <Button onClick={handleLoadMore} disabled={loading} className="mt-4">
          {loading ? "Завантаження..." : "Показати ще"}
        </Button>
      )}
    </>
  );
}
