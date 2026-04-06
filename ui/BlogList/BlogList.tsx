import { Panel } from "@/ui/Panel/Panel";
import { PostPreview } from "@/ui/PostPreview";
import { getBlogPosts } from "@/app/blog/firebase";

export async function BlogList() {
  const blogPosts = await getBlogPosts();

  const posts = blogPosts.map((post) => (
    <Panel key={post.id}>
      <PostPreview
        post={{
          id: post.id,
          title: post.title,
          description: post.description,
          content: post.content,
          authorId: post.author?.id,
          authorNickname: post.author?.nickname,
        }}
      />
    </Panel>
  ));

  return <>{posts}</>;
}
