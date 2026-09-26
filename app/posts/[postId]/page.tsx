import Link from "next/link";

import { getPost } from "@/lib/api";

type PostPageProps = {
  params: Promise<{
    postId: string;
  }>;
};

export default async function PostPage({
  params,
}: PostPageProps) {
  const { postId } = await params;

  const post = await getPost(postId);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/posts"
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to posts
      </Link>

      <article className="mt-8">
        <h1 className="text-4xl font-bold text-gray-900">
          {post.title}
        </h1>

        <p className="mt-3 text-sm text-gray-500">
          By {post.user.email}
        </p>

        <div className="mt-8 whitespace-pre-wrap text-lg leading-8 text-gray-700">
          {post.content}
        </div>
      </article>
    </main>
  );
}