export type User = {
  id: number;
  email: string;
  is_active: boolean;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  published: boolean;
  user: User;
};