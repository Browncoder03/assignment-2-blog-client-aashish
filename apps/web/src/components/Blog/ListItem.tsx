import type { Post } from "@repo/db/data";
import Link from "next/link";

// Different colours for the tags.
// Each colour includes a matching dark-mode style.
const tagColours = [
  "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200",
  "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-200",
  "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-200",
];

export function BlogListItem({
  post,
}: {
  post: Post;
}) {
  // Remove punctuation only from the end of the displayed title.
  // The original title in the database remains unchanged.
  const displayTitle = post.title.replace(/[!?.]+$/, "");

  // Convert comma-separated tags into an array.
  // Remove extra spaces and empty tags.
  const postTags = post.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  // Display dates in a readable format, such as 01 Oct 2024.
  const formattedDate = post.date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <article
      // The group class lets the image react when the card is hovered.
      // The card uses one column on small screens and two on desktop.
      // Reduced-motion settings disable the movement.
      className="
        group grid gap-6 rounded-2xl
        border border-violet-200 bg-white p-5
        shadow-sm transition-all duration-200
        hover:-translate-y-1 hover:border-violet-400
        hover:shadow-xl hover:shadow-violet-500/10
        dark:border-violet-900 dark:bg-gray-900
        dark:hover:border-violet-500
        md:grid-cols-[220px_1fr]
        motion-reduce:transition-none
        motion-reduce:hover:translate-y-0
      "
      data-test-id={`blog-post-${post.id}`}
    >
      {/* Clip the image inside rounded corners when it zooms. */}
      <div className="overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="
            h-48 w-full object-cover
            transition-transform duration-300
            group-hover:scale-105 md:h-full
            motion-reduce:transition-none
            motion-reduce:group-hover:scale-100
          "
        />
      </div>

      {/* Post information */}
      <div className="flex min-w-0 flex-col">
        {/* Publication date and category */}
        <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span>{formattedDate}</span>

          {/* Decorative separator, ignored by screen readers. */}
          <span
            aria-hidden="true"
            className="text-violet-400"
          >
            &bull;
          </span>

          <span className="font-medium text-gray-600 dark:text-gray-300">
            {post.category}
          </span>
        </div>

        {/* Keep the existing link to the individual post page. */}
        <Link
          href={`/post/${post.urlId}`}
          className="
            rounded text-xl font-semibold leading-snug
            text-violet-900 transition-colors
            hover:text-violet-600
            focus-visible:outline-2
            focus-visible:outline-offset-4
            focus-visible:outline-violet-500
            dark:text-violet-100 dark:hover:text-violet-300
          "
        >
          {displayTitle}
        </Link>

        {/* Limit the preview description to three lines. */}
        <p className="mt-3 line-clamp-3 leading-6 text-gray-600 dark:text-gray-300">
          {post.description}
        </p>

        {/* Cycle through purple, pink and teal tag colours. */}
        <div className="mt-4 flex flex-wrap gap-2">
          {postTags.map((tag, index) => (
            <span
              key={tag}
              className={`
                rounded-full px-3 py-1 text-xs font-semibold
                ${tagColours[index % tagColours.length]}
              `}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Keep the original view and like counts. */}
        <div
          className="
            mt-5 flex flex-wrap items-center gap-6
            border-t border-violet-100 pt-4
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