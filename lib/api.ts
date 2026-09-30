import type { Post } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("access_token");
}

function handleUnauthorized() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("access_token");

  window.location.href = "/dashboard/login";
}

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();

    // FastAPI HTTPException:
    // { "detail": "Could not validate credentials" }
    if (typeof data.detail === "string") {
      return data.detail;
    }

    // FastAPI validation errors:
    // { "detail": [...] }
    if (Array.isArray(data.detail)) {
      return data.detail
        .map((error: { msg?: string }) => error.msg)
        .filter(Boolean)
        .join(", ");
    }

    return "Something went wrong.";
  } catch {
    return "Something went wrong.";
  }
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAccessToken();

  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    handleUnauthorized();

    throw new ApiError("Your session has expired. Please log in again.", 401);
  }

  if (!response.ok) {
    const message = await getErrorMessage(response);

    throw new ApiError(message, response.status);
  }

  return response.json();
}

export async function getPosts(): Promise<Post[]> {
  return apiFetch<Post[]>("/posts/");
}

export async function getPost(postId: string): Promise<Post> {
  return apiFetch<Post>(`/posts/${postId}`);
}

export async function login(email: string, password: string) {
  const body = new URLSearchParams();

  body.append("username", email);
  body.append("password", password);

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!response.ok) {
      const message = await getErrorMessage(response);

      throw new ApiError(message, response.status);
    }

    return response.json();
  } catch (error) {
    // Preserve errors we intentionally created above
    if (error instanceof ApiError) {
      throw error;
    }

    // Backend unreachable / network failure
    throw new ApiError(
      "Unable to connect to the server. Please try again.",
      0,
    );
  }
}

export async function getMyPosts(): Promise<Post[]> {
  return apiFetch<Post[]>("/my/posts/");
}

export { ApiError };