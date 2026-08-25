import { posts } from "@repo/db/data";

import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";

export function LeftMenu({
  selectedCategory,
  selectedTag,
  selectedYear,
  selectedMonth,
}: {
  selectedCategory?: string;
  selectedTag?: string;
  selectedYear?: string;
  selectedMonth?: string;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Blog title and short description */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Full Stack Blog
        </h1>

        <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
          Articles, ideas and practical guides for modern web development.
        </p>
      </div>

      {/* Main sidebar navigation */}
      <nav className="space-y-8">
        {/* Categories section */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Categories
          </h2>

          <ul className="space-y-1">
            <CategoryList
              posts={posts}

              // Pass the selected category so it can be highlighted
              selectedCategory={selectedCategory}
            />
          </ul>
        </section>

        {/* History section */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            History
          </h2>

          <ul className="space-y-1">
            <HistoryList
              posts={posts}

              // These values tell HistoryList which month/year is selected
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
            />
          </ul>
        </section>

        {/* Tags section */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Tags
          </h2>

          <ul className="space-y-1">
            <TagList
              posts={posts}

              // Pass the selected tag so it can be highlighted
              selectedTag={selectedTag}
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