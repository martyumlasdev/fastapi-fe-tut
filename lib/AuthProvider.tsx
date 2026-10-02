"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import { setUnauthorizedHandler } from "./api";

type AuthContextValue = {
  logout: () => void;
};

export const AuthContext =
  createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({
  children,
}: AuthProviderProps) {
  const router = useRouter();

  const isLoggingOut = useRef(false);

  const logout = useCallback(() => {
    if (isLoggingOut.current) {
      return;
    }

    isLoggingOut.current = true;

    localStorage.removeItem("access_token");

    router.replace("/login");
  }, [router]);

  useEffect(() => {
    setUnauthorizedHandler(logout);

    return () => {
      setUnauthorizedHandler(null);
    };
  }, [logout]);

  return (
    <AuthContext.Provider value={{ logout }}>
      {children}
    </AuthContext.Provider>
  );
}