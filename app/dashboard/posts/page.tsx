"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getMyPosts } from "@/lib/api";
import type { Post } from "@/lib/types";

export default function MyPostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    async function loadPosts() {
      try {
        const data = await getMyPosts();
        setPosts(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadPosts();
  }, [router]);

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