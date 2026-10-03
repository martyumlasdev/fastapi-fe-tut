"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ApiError, createPost } from "@/lib/api";

export default function NewPostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: React.SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }

    if (!content.trim()) {
      toast.error("Content is required.");
      return;
    }

    try {
      setIsSubmitting(true);

      await createPost(
        title.trim(),
        content.trim(),
        published,
      );

      toast.success("Post created successfully.");

      router.replace("/dashboard/posts");
    } catch (error) {

      console.error("Create post error:", error);
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          New Post
        </h1>

        <p className="mt-2 text-gray-600">
          Create a new blog post.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Enter post title"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Content
          </label>

          <textarea
            id="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={10}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Write your post..."
            disabled={isSubmitting}
          />
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={published}
            onChange={(event) => setPublished(event.target.checked)}
            disabled={isSubmitting}
            className="h-4 w-4"
          />

          <span className="text-sm text-gray-700">
            Publish immediately
          </span>
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Post"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}