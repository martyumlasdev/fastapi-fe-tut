import PostCard from "@/components/posts/Postcard";
import { getPosts } from "@/lib/api";

export default async function PostsPage() {
  const posts = await getPosts();

  return (
   <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Posts
        </h1>

        <p className="mt-2 text-gray-600">
          Latest posts from our blog.
        </p>
      </div>

      <div className="space-y-5">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
          />
        ))}
      </div>
    </main>
  );
}