"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import Loading from "@/components/ui/Loading";
import { ApiError, deletePost, getMyPosts } from "@/lib/api";
import type { Post } from "@/lib/types";

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        const posts = await getMyPosts();

        setPosts(posts);
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
    return <Loading />;
  }

  async function handleDelete(postId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingPostId(postId);

      await deletePost(String(postId));

      setPosts((currentPosts) =>
        currentPosts.filter((post) => post.id !== postId),
      );

      toast.success("Post deleted successfully.");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setDeletingPostId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Posts</h1>

          <p className="mt-2 mb-3 text-gray-600">Manage your posts.</p>

          <Link
            href="/dashboard/posts/new"
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            New Post
          </Link>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {posts.map((post) => (
          <article
            key={post.id}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-900">
             {post.id} {post.title}
            </h2>

            <p className="mt-2 text-gray-600">{post.content}</p>

            <div className="mt-4">
              <Link
                href={`/dashboard/posts/${post.id}`}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Edit
              </Link>
               <button
                  type="button"
                  onClick={() => handleDelete(post.id)}
                  disabled={deletingPostId === post.id}
                  className="text-sm font-medium text-red-600 hover:underline disabled:cursor-not-allowed ml-4 disabled:opacity-50"
                >
                  {deletingPostId === post.id
                    ? "Deleting..."
                    : "Delete"}
                </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
