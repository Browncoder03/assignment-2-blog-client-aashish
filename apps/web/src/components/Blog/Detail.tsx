import { marked } from "marked";
import Link from "next/link";

import { LikeButton } from "./LikeButton";

// Assignment 2.3 gets the post from Prisma instead
// of the old static @repo/db/data array.
type DetailPost = {
  id: number;
  urlId: string;
  title: string;
  content: string;
  category: string;
  description: string;
  imageUrl: string;
  tags: string;
  active: boolean;
  date: Date;
  views: number;
  likes: number;
};

export async function BlogDetail({
  post,
}: {
  post: DetailPost;
}) {
  // Convert Markdown into HTML.
  const content = await marked.parse(post.content);

  // Split comma-separated tags.
  const postTags = post.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  // Format date:
  // 18 Apr 2022
  const formattedDate = post.date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );

  return (
    <article
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

      {/* Tags */}
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
      <div className="mt-5 flex items-center gap-5 border-b border-gray-200 pb-6 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <span>{post.views} views</span>

        <LikeButton
          postId={post.id}
          initialLikes={post.likes}
        />
      </div>

      {/* Markdown content */}
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