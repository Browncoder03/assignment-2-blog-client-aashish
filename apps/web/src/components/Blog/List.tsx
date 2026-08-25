import type { Post } from "@repo/db/data";

import { BlogListItem } from "./ListItem";

export function BlogList({ posts }: { posts: Post[] }) {
  return (
    <div className="py-8">
      {/* Blog page heading */}
      <div className="mb-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          Latest Articles
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          From the blog
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-400">
          Explore practical guides, development insights and useful ideas
          from the world of full-stack development.
        </p>

        {/* Number of available posts */}
        <div className="mt-5">
          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {posts.length} Posts
          </span>
        </div>
      </div>

      {/* Blog posts */}
      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <BlogListItem
              key={post.id}
              post={post}
            />
          ))}
        </div>
      ) : (
        /* Empty search/category state */
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            No articles found
          </h2>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Try another search or explore a different category.
          </p>
        </div>
      )}
    </div>
  );
}

export default BlogList;