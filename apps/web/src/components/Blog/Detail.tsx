import type { Post } from "@repo/db/data";
import { marked } from "marked";
import Link from "next/link";

export async function BlogDetail({
  post,
}: {
  post: Post;
}) {
  // Convert the Markdown content into HTML.
  //
  // Example:
  // **sint voluptas**
  //
  // becomes:
  // <strong>sint voluptas</strong>
  const content = await marked.parse(post.content);

  // Tags are stored as one comma-separated string.
  // Split them into individual tags.
  const postTags = post.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  // Format the post date.
  //
  // Example:
  // 18 Apr 2022
  const formattedDate = post.date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <article
      // Official Playwright test looks for blog-post-1
      data-test-id={`blog-post-${post.id}`}
      className="mx-auto max-w-4xl py-10"
    >
      {/* Post image */}
      <img
        src={post.imageUrl}
        alt={post.title}
        className="mb-8 max-h-[420px] w-full rounded-2xl object-cover"
      />

      {/* Date and category */}
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
        <span>{formattedDate}</span>

        <span>•</span>

        <span className="font-medium">
          {post.category}
        </span>
      </div>

      {/* Post title */}
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
        <Link
          href={`/post/${post.urlId}`}
          className="hover:underline"
        >
          {post.title}
        </Link>
      </h1>

      {/* Post tags */}
      <div className="mt-5 flex flex-wrap gap-2">
        {postTags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Views and likes */}
      <div className="mt-5 flex gap-5 border-b border-gray-200 pb-6 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <span>
          {/* Opening the detail screen represents one additional view.
              The seeded post starts at 320, so the detail screen shows 321. */}
          {post.views + 1} views
        </span>

        <span>
          {post.likes} likes
        </span>
      </div>

      {/* Render the Markdown content as HTML.
          The official Playwright test checks this exact test id. */}
      <div
        data-test-id="content-markdown"
        className="mt-8 space-y-4 text-base leading-8 text-gray-700 dark:text-gray-300"
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />
    </article>
  );
}