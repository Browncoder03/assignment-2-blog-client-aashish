"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { togglePostActive } from "../app/actions";

// Shape of the post sent from app/page.tsx.
type AdminPost = {
  id: number;
  urlId: string;
  title: string;
  content: string;
  category: string;
  description: string;
  imageUrl: string;
  tags: string;
  active: boolean;
  views: number;

  // Server converts Prisma Date to ISO string.
  date: string;
};

export function AdminPostList({
  posts,
}: {
  posts: AdminPost[];
}) {
  const router = useRouter();

  // Lets us know while a database update is happening.
  const [isPending, startTransition] = useTransition();

  // Filter by title/content.
  const [contentFilter, setContentFilter] = useState("");

  // Filter by tag.
  const [tagFilter, setTagFilter] = useState("");

  // Test enters dates such as 01012022.
  const [dateFilter, setDateFilter] = useState("");

  // Default = newest first.
  const [sortBy, setSortBy] = useState("date-desc");

  // Optional message after activating/deactivating.
  const [statusMessage, setStatusMessage] = useState("");

  // ---------------------------------------------------------
  // FILTER AND SORT
  // ---------------------------------------------------------

  const filteredPosts = useMemo(() => {
    // Work with a copy of the database posts.
    let result = [...posts];

    // -------------------------------------------------------
    // FILTER BY TITLE OR CONTENT
    // -------------------------------------------------------

    const contentQuery = contentFilter.trim().toLowerCase();

    if (contentQuery) {
      result = result.filter((post) => {
        const title = post.title.toLowerCase();
        const content = post.content.toLowerCase();

        return (
          title.includes(contentQuery) ||
          content.includes(contentQuery)
        );
      });
    }

    // -------------------------------------------------------
    // FILTER BY TAG
    // -------------------------------------------------------

    const tagQuery = tagFilter.trim().toLowerCase();

    if (tagQuery) {
      result = result.filter((post) =>
        post.tags.toLowerCase().includes(tagQuery),
      );
    }

    // -------------------------------------------------------
    // FILTER BY DATE
    // -------------------------------------------------------

    // Example:
    // 01012022
    //
    // month = 01
    // day   = 01
    // year  = 2022

    if (/^\d{8}$/.test(dateFilter)) {
      const month = Number(dateFilter.slice(0, 2));
      const day = Number(dateFilter.slice(2, 4));
      const year = Number(dateFilter.slice(4, 8));

      const selectedDate = new Date(year, month - 1, day);

      result = result.filter(
        (post) => new Date(post.date) >= selectedDate,
      );
    }

    // -------------------------------------------------------
    // SORT
    // -------------------------------------------------------

    result.sort((a, b) => {
      if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === "title-desc") {
        return b.title.localeCompare(a.title);
      }

      if (sortBy === "date-asc") {
        return (
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
        );
      }

      // Default:
      // newest first.
      return (
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
      );
    });

    return result;
  }, [
    posts,
    contentFilter,
    tagFilter,
    dateFilter,
    sortBy,
  ]);

  // ---------------------------------------------------------
  // ASSIGNMENT 2.3
  // ACTIVATE / DEACTIVATE POST
  // ---------------------------------------------------------

  function handleToggle(
    postId: number,
    title: string,
    currentlyActive: boolean,
  ) {
    startTransition(async () => {
      // Update the real SQLite database.
      await togglePostActive(postId);

      setStatusMessage(
        `Post "${title}" is now ${
          currentlyActive ? "Inactive" : "Active"
        }.`,
      );

      // Ask the server component to run again.
      // This gets the new post.active value from Prisma.
      router.refresh();
    });
  }

  return (
    <div>
      {/* ---------------------------------------------------
          FILTERS
      --------------------------------------------------- */}

      <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Posts
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Filter, sort and manage blog posts.
            </p>
          </div>

          {/* Opens Assignment 2.3 create screen */}
          <Link
            href="/posts/create"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Create Post
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* CONTENT FILTER */}
          <div>
            <label
              htmlFor="content-filter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Filter by Content:
            </label>

            <input
              id="content-filter"
              type="text"
              value={contentFilter}
              onChange={(event) =>
                setContentFilter(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          {/* TAG FILTER */}
          <div>
            <label
              htmlFor="tag-filter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Filter by Tag:
            </label>

            <input
              id="tag-filter"
              type="text"
              value={tagFilter}
              onChange={(event) =>
                setTagFilter(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          {/* DATE FILTER */}
          <div>
            <label
              htmlFor="date-filter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Filter by Date Created:
            </label>

            <input
              id="date-filter"
              type="text"
              inputMode="numeric"
              maxLength={8}
              value={dateFilter}
              onChange={(event) =>
                setDateFilter(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          {/* SORT */}
          <div>
            <label
              htmlFor="sort-by"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Sort By:
            </label>

            <select
              id="sort-by"
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="date-desc">
                Date - Newest First
              </option>

              <option value="date-asc">
                Date - Oldest First
              </option>

              <option value="title-asc">
                Title - A to Z
              </option>

              <option value="title-desc">
                Title - Z to A
              </option>
            </select>
          </div>
        </div>

        {/* Message after database update */}
        {statusMessage && (
          <p className="mt-4 rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-600">
            {statusMessage}
          </p>
        )}
      </section>

      {/* ---------------------------------------------------
          POST LIST
      --------------------------------------------------- */}

      <section className="space-y-5">
        {filteredPosts.map((post) => {
          const formattedTags = post.tags
            .split(",")
            .map((tag) => `#${tag.trim()}`)
            .join(", ");

          const formattedDate = new Date(
            post.date,
          ).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          });

          return (
            <article
              key={post.id}
              data-test-id={`blog-post-${post.id}`}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="flex flex-col md:flex-row">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="h-52 w-full object-cover md:h-auto md:w-64"
                />

                <div className="flex flex-1 flex-col p-6">
                  {/* Opens update post screen */}
                  <Link
                    href={`/post/${post.urlId}`}
                    className="text-xl font-bold text-gray-900 hover:underline"
                  >
                    {post.title}
                  </Link>

                  <p className="mt-2 text-sm font-medium text-gray-600">
                    {post.category}
                  </p>

                  <p className="mt-3 text-sm text-gray-500">
                    {formattedTags}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Posted on {formattedDate}
                  </p>

                  <div className="mt-auto pt-5">
                    {/* Assignment 2.3:
                        clicking this changes the DATABASE */}

                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() =>
                        handleToggle(
                          post.id,
                          post.title,
                          post.active,
                        )
                      }
                      className={
                        post.active
                          ? "rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
                          : "rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600"
                      }
                    >
                      {post.active
                        ? "Active"
                        : "Inactive"}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}