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


export async function login(
  email: string,
  password: string,
) {
  const body = new URLSearchParams();

  body.append("username", email);
  body.append("password", password);

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    throw new Error("Invalid email or password");
  }

  return response.json();
}

function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("access_token");
}


export async function getMyPosts(): Promise<Post[]> {
  const token = getAccessToken();

  console.log("Token:", token);

  const response = await fetch(`${API_URL}/my/posts/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();

    console.error("GET /my/posts/ failed:", {
      status: response.status,
      body: error,
    });

    throw new Error(error);
  }

  return response.json();
}