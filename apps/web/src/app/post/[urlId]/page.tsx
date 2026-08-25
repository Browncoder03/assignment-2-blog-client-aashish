import { notFound } from "next/navigation";
import { posts } from "@repo/db/data";

import { AppLayout } from "@/components/Layout/AppLayout";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  // Get the post id from the URL
  // Example: /post/hello-world
  const { urlId } = await params;

  // Find the matching active post
  const post = posts.find(
    (item) => item.urlId === urlId && item.active,
  );

  // If no matching active post exists, show Next.js 404 page
  if (!post) {
    notFound();
  }

  // Split comma-separated tags
  const postTags = post.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  // Format date like: 01 Oct 2024
  const formattedDate = post.date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <AppLayout>
      <article className="mx-auto max-w-4xl py-10">
        {/* Category and date */}
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {post.category}
          </span>

          <span>•</span>

          <span>{formattedDate}</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          {post.title}
        </h1>

        {/* Description */}
        <p className="mt-5 text-lg leading-8 text-gray-600 dark:text-gray-300">
          {post.description}
        </p>

        {/* Tags */}
        <div className="mt-6 flex flex-wrap gap-2">
          {postTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Image */}
        <div className="mt-8 overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="h-auto w-full object-cover"
          />
        </div>

        {/* Views and likes */}
        <div className="mt-6 flex gap-6 border-b border-gray-200 pb-6 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
          <span>{post.views} views</span>
          <span>{post.likes} likes</span>
        </div>

        {/* Full article content */}
        <div className="prose prose-gray mt-10 max-w-none dark:prose-invert">
          <p className="whitespace-pre-line leading-8 text-gray-700 dark:text-gray-300">
            {post.content}
          </p>
        </div>
      </article>
    </AppLayout>
  );
}