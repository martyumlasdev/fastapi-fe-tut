import PostCard from "@/components/posts/Postcard";
import { getPosts } from "@/lib/api";

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <main>
      <h1>Posts</h1>

     {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </main>
  );
}