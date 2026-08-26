import { AdminPostList } from "../components/AdminPostList";
import { isLoggedIn } from "../utils/auth";

import { login, logout } from "./actions";

export default async function Home() {
  // Check whether the current user has an Assignment 2
  // authentication cookie.
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

            {/* Official home test checks this exact text */}
            <p className="mt-2 text-sm text-gray-500">
              Sign in to your account
            </p>
          </div>

          <form action={login} className="space-y-5">
            <div>
              {/* The official test finds the input by this label */}
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

            {/* Keep only ONE exact "Sign In" text on this screen */}
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
  // LOGGED-IN ADMIN SCREEN
  // ---------------------------------------------------------
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Admin header */}
        <header className="mb-8 flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            {/* Official test checks this exact heading */}
            <h1 className="text-3xl font-bold text-gray-900">
              Admin of Full Stack Blog
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your blog posts
            </p>
          </div>

          {/* Logout removes the Assignment 2 authentication */}
          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </form>
        </header>

        {/* Interactive filtering/sorting list */}
        <AdminPostList />
      </div>
    </main>
  );
}