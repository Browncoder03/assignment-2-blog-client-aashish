import { client } from "@repo/db/client";

import { AdminPostList } from "../components/AdminPostList";
import { isLoggedIn } from "../utils/auth";

import { login, logout } from "./actions";

export default async function Home() {
  // Check whether the current user is logged in.
  const loggedIn = await isLoggedIn();

  // ---------------------------------------------------------
  // LOGGED OUT SCREEN
  // ---------------------------------------------------------

  if (!loggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Login
            </h1>

            {/* Official test checks this exact text */}
            <p className="mt-2 text-sm text-gray-500">
              Sign in to your account
            </p>
          </div>

          <form action={login} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-gray-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-gray-900 px-4 py-3 font-medium text-white hover:bg-gray-800"
            >
              Sign In
            </button>
          </form>
        </section>
      </main>
    );
  }

  // ---------------------------------------------------------
  // ASSIGNMENT 2.3
  // LOAD POSTS FROM THE REAL DATABASE
  // ---------------------------------------------------------

  const databasePosts = await client.db.post.findMany();

  // Convert Date into a string before passing it from
  // the server component to our client component.
  const posts = databasePosts.map((post) => ({
    id: post.id,
    urlId: post.urlId,
    title: post.title,
    content: post.content,
    category: post.category,
    description: post.description,
    imageUrl: post.imageUrl,
    tags: post.tags,
    active: post.active,
    views: post.views,
    date: post.date.toISOString(),
  }));

  // ---------------------------------------------------------
  // LOGGED-IN ADMIN SCREEN
  // ---------------------------------------------------------

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin of Full Stack Blog
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your blog posts
            </p>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </form>
        </header>

        {/* Posts now come from Prisma instead of static data */}
        <AdminPostList posts={posts} />
      </div>
    </main>
  );
}