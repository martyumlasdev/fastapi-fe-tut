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

export type Permission = {
  id: number;
  name: string;
  description: string | null;
};

export type Role = {
  id: number;
  name: string;
  description: string | null;
  permissions: Permission[];
};

export type AdminUser = {
  id: number;
  email: string;
  roles: {
    id: number;
    name: string;
  }[];
};
