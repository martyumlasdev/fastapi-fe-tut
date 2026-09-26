import type { Post } from "@/lib/types";

type PostCardProps = {
  post: Post;
};

export default function PostCard({ post }: PostCardProps) {
  return (
    <article>
      <h2>{post.title}</h2>

      <p>{post.content}</p>

      <small>By {post.user.email}</small>
    </article>
  );
}