import type { Post } from "@repo/db/data";

import { BlogListItem } from "./ListItem";
import { Pagination } from "./Pagination";

// Normal users see three blog posts on each page.
// This preserves the original assignment test.
const DEFAULT_POSTS_PER_PAGE = 3;

type BlogListProps = {
  posts: Post[];

  // Optional values keep older components and tests compatible.
  currentPage?: number;
  postsPerPage?: number;
};

export function BlogList({
  posts,
  currentPage = 1,
  postsPerPage = DEFAULT_POSTS_PER_PAGE,
}: BlogListProps) {
  // Reject invalid page-size values and prevent extremely
  // large values from being supplied through the URL.
  const safePostsPerPage =
    Number.isInteger(postsPerPage) && postsPerPage > 0
      ? Math.min(postsPerPage, 50)
      : DEFAULT_POSTS_PER_PAGE;

  // Calculate how many pagination pages are required.
  const totalPages = Math.ceil(
    posts.length / safePostsPerPage,
  );

  // Prevent invalid page numbers such as zero, negative numbers,
  // or numbers greater than the final available page.
  const safeCurrentPage = Math.min(
    Math.max(currentPage, 1),
    totalPages || 1,
  );

  // Find the section of the posts array belonging to this page.
  const startIndex =
    (safeCurrentPage - 1) * safePostsPerPage;

  const endIndex = startIndex + safePostsPerPage;
  const visiblePosts = posts.slice(startIndex, endIndex);

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

        {/* Show the total number of matching posts */}
        <div className="mt-5">
          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {posts.length} Posts
          </span>
        </div>
      </div>

      {/* Display only posts belonging to the selected page */}
      {visiblePosts.length > 0 ? (
        <div className="space-y-6">
          {visiblePosts.map((post) => (
            <BlogListItem
              key={post.id}
              post={post}
            />
          ))}
        </div>
      ) : (
        /* Empty search or category state */
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            No articles found
          </h2>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Try another search or explore a different category.
          </p>
        </div>
      )}

      {/* Hide pagination automatically when only one page exists */}
      <Pagination
        currentPage={safeCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
}

export default BlogList;