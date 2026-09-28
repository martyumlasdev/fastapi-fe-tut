import type { Post } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("access_token");
}

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = getAccessToken();

  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // JWT expired / invalid
  if (response.status === 401) {
    localStorage.removeItem("access_token");
    window.location.href = "/dashboard/login";

    throw new Error("Authentication expired");
  }

  return response;
}

export async function getPosts(): Promise<Post[]> {
  const response = await apiFetch("/posts/");

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
}

export async function getPost(postId: string): Promise<Post> {
  const response = await apiFetch(`/posts/${postId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch post");
  }

  return response.json();
}

export async function login(email: string, password: string) {
  const body = new URLSearchParams();

  body.append("username", email);
  body.append("password", password);

  // Login does not use apiFetch because we don't have a token yet.
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

export async function getMyPosts(): Promise<Post[]> {
  const response = await apiFetch("/my/posts/");

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