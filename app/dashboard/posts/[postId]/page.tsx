"use client";

import { useEffect, useState } from "react";
import type { SyntheticEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import Loading from "@/components/ui/Loading";
import {
  ApiError,
  getMyPost,
  updatePost,
} from "@/lib/api";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();

  const postId = params.postId as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(true);

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        const post = await getMyPost(postId);

        setTitle(post.title);
        setContent(post.content);
        setPublished(post.published);
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

    loadPost();
  }, [postId]);

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>,
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

      await updatePost(
        postId,
        title.trim(),
        content.trim(),
        published,
      );

      toast.success("Post updated successfully.");

      router.replace("/dashboard/posts");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Edit Post
        </h1>

        <p className="mt-2 text-gray-600">
          Update your blog post.
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
            onChange={(event) =>
              setTitle(event.target.value)
            }
            disabled={isSubmitting}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
            onChange={(event) =>
              setContent(event.target.value)
            }
            rows={10}
            disabled={isSubmitting}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={published}
            onChange={(event) =>
              setPublished(event.target.checked)
            }
            disabled={isSubmitting}
            className="h-4 w-4"
          />

          <span className="text-sm text-gray-700">
            Published
          </span>
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
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