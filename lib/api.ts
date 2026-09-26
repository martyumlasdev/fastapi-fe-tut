import type { Post } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getPosts(): Promise<Post[]> {
  const response = await fetch(`${API_URL}/posts/`);

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
}


export async function getPost(postId: string): Promise<Post> {
  const response = await fetch(`${API_URL}/posts/${postId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch post");
  }

  return response.json();
}