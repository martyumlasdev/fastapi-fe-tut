"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ApiError, getMyPosts } from "@/lib/api";
import type { Post } from "@/lib/types";
import { toast } from "sonner";

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getMyPosts();

        setPosts(data);
      } catch (error) {
        if (error instanceof ApiError) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">
        My Posts
      </h1>

      <p className="mt-2 text-gray-600">
        Manage your posts.
      </p>

      <div className="mt-8 space-y-4">
        {posts.map((post) => (
          <article
            key={post.id}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-900">
              {post.title}
            </h2>

            <p className="mt-2 text-gray-600">
              {post.content}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}