import type { Post } from "@/lib/types";
import Link from "next/link";

type PostCardProps = {
  post: Post;
};

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <h2 className="text-xl font-semibold text-gray-900">
        <Link href={`/posts/${post.id}`} className="hover:text-blue-600">
          {post.title}
        </Link>
      </h2>

      <p className="mt-3 line-clamp-3 text-gray-600">{post.content}</p>

      <div className="mt-4 text-sm text-gray-500">By {post.user.email}</div>
    </article>
  );
}
