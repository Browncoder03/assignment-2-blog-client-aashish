import type { Post } from "@repo/db/data";
import Link from "next/link";

export function BlogListItem({
  post,
}: {
  post: Post;
}) {
  // Remove punctuation only from the end of the title
  // Example: "Hello, World!" -> "Hello, World"
  const displayTitle = post.title.replace(/[!?.]+$/, "");

  // Split tags like "Back-End,Databases"
  // into ["Back-End", "Databases"]
  const postTags = post.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  // Format the date like: 01 Oct 2024
  const formattedDate = post.date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <article
      className="
        grid gap-6 rounded-2xl border border-gray-200 bg-white p-5
        shadow-sm transition-all duration-200
        hover:-translate-y-1 hover:shadow-md
        dark:border-gray-800 dark:bg-gray-900
        md:grid-cols-[220px_1fr]
      "
      data-test-id={`blog-post-${post.id}`}
    >
      {/* Post image */}
      <div className="overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="
            h-48 w-full object-cover transition-transform duration-300
            hover:scale-105 md:h-full
          "
        />
      </div>

      {/* Post information */}
      <div className="flex min-w-0 flex-col">
        {/* Date and category */}
        <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span>{formattedDate}</span>

          <span className="text-gray-300 dark:text-gray-700">
            •
          </span>

          <span className="font-medium text-gray-600 dark:text-gray-300">
            {post.category}
          </span>
        </div>

        {/* Post title */}
        <Link
          href={`/post/${post.urlId}`}
          className="
            text-xl font-semibold leading-snug text-gray-900
            transition-colors hover:text-gray-600
            dark:text-white dark:hover:text-gray-300
          "
        >
          {displayTitle}
        </Link>

        {/* Description */}
        <p className="mt-3 line-clamp-3 leading-6 text-gray-600 dark:text-gray-300">
          {post.description}
        </p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {postTags.map((tag) => (
            <span
              key={tag}
              className="
                rounded-full bg-gray-100 px-3 py-1 text-xs font-medium
                text-gray-700
                dark:bg-gray-800 dark:text-gray-300
              "
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Bottom information */}
        <div
          className="
            mt-5 flex flex-wrap items-center gap-6
            border-t border-gray-100 pt-4
            text-sm text-gray-500
            dark:border-gray-800 dark:text-gray-400
          "
        >
          <span>{post.views} views</span>

          <span>{post.likes} likes</span>
        </div>
      </div>
    </article>
  );
}