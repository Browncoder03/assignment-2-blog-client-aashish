import { posts } from "@repo/db/data";

import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";

export function LeftMenu() {
  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Full Stack Blog
        </h1>

        <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
          Articles, ideas and practical guides for modern web development.
        </p>
      </div>

      {/* Sidebar navigation */}
      <nav className="space-y-8">
        {/* Categories */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Categories
          </h2>

          <ul className="space-y-1">
            <CategoryList posts={posts} />
          </ul>
        </section>

        {/* History */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            History
          </h2>

          <ul className="space-y-1">
            <HistoryList
              selectedYear=""
              selectedMonth=""
              posts={posts}
            />
          </ul>
        </section>

        {/* Tags */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Tags
          </h2>

          <ul className="space-y-1">
            <TagList
              selectedTag=""
              posts={posts}
            />
          </ul>
        </section>
      </nav>

      {/* Admin link */}
      <div className="mt-8 border-t border-gray-200 pt-5 dark:border-gray-800">
        <a
          href="http://localhost:3002"
          className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          Admin Dashboard
        </a>
      </div>
    </div>
  );
}