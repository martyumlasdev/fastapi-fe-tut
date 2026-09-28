"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("access_token");
    router.replace("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-5">
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>

        <nav className="flex flex-1 flex-col p-4">
          <div>
            <Link
              href="/dashboard/posts"
              className="block rounded-lg px-4 py-2.5 text-gray-700 hover:bg-gray-100"
            >
              My Posts
            </Link>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-auto w-full rounded-lg px-4 py-2.5 text-left text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-100 p-8">{children}</main>
    </div>
  );
}
