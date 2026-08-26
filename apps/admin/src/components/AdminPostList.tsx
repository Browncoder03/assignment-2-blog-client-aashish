"use client";

import { posts } from "@repo/db/data";
import Link from "next/link";
import { useMemo, useState } from "react";

export function AdminPostList() {
  // Text used to filter by post title or content.
  const [contentFilter, setContentFilter] = useState("");

  // Text used to filter by tags.
  const [tagFilter, setTagFilter] = useState("");

  // The official test enters dates like 01012022.
  const [dateFilter, setDateFilter] = useState("");

  // Default sort is newest post first.
  const [sortBy, setSortBy] = useState("date-desc");

  // Assignment 2 only requires the active button
  // to display a message when clicked.
  const [statusMessage, setStatusMessage] = useState("");

  const filteredPosts = useMemo(() => {
    // Make a copy so we do not change the original post data.
    let result = [...posts];

    // ---------------------------------------------------------
    // FILTER BY TITLE OR CONTENT
    // ---------------------------------------------------------
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

    // ---------------------------------------------------------
    // FILTER BY TAG
    // ---------------------------------------------------------
    const tagQuery = tagFilter.trim().toLowerCase();

    if (tagQuery) {
      result = result.filter((post) =>
        post.tags.toLowerCase().includes(tagQuery),
      );
    }

    // ---------------------------------------------------------
    // FILTER BY DATE
    // ---------------------------------------------------------
    //
    // Example test input:
    // 01012022
    //
    // We interpret that as:
    // month = 01
    // day = 01
    // year = 2022
    if (/^\d{8}$/.test(dateFilter)) {
      const month = Number(dateFilter.slice(0, 2));
      const day = Number(dateFilter.slice(2, 4));
      const year = Number(dateFilter.slice(4, 8));

      const selectedDate = new Date(year, month - 1, day);

      result = result.filter(
        (post) => post.date >= selectedDate,
      );
    }

    // ---------------------------------------------------------
    // SORT POSTS
    // ---------------------------------------------------------
    result.sort((a, b) => {
      if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === "title-desc") {
        return b.title.localeCompare(a.title);
      }

      if (sortBy === "date-asc") {
        return a.date.getTime() - b.date.getTime();
      }

      // Default is date descending.
      return b.date.getTime() - a.date.getTime();
    });

    return result;
  }, [contentFilter, tagFilter, dateFilter, sortBy]);

  return (
    <div>
      {/* Filter and sort controls */}
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

          {/* Official test expects this exact link text */}
          <Link
            href="/posts/create"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Create Post
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Content filter */}
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

          {/* Tag filter */}
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

          {/* Date filter */}
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

          {/* Sorting */}
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

        {/* Status message shown after clicking Active/Inactive */}
        {statusMessage && (
          <p className="mt-4 rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-600">
            {statusMessage}
          </p>
        )}
      </section>

      {/* Post list */}
      <section className="space-y-5">
        {filteredPosts.map((post) => {
          // Convert tags into:
          // #Front-End, #Dev Tools
          const formattedTags = post.tags
            .split(",")
            .map((tag) => `#${tag.trim()}`)
            .join(", ");

          // Format dates like:
          // Dec 16, 2024
          const formattedDate = post.date.toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "2-digit",
              year: "numeric",
            },
          );

          return (
            <article
              key={post.id}
              data-test-id={`blog-post-${post.id}`}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="flex flex-col md:flex-row">
                {/* Post image */}
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="h-52 w-full object-cover md:h-auto md:w-64"
                />

                <div className="flex flex-1 flex-col p-6">
                  {/* Title opens the modify screen */}
                  <Link
                    href={`/post/${post.urlId}`}
                    className="text-xl font-bold text-gray-900 hover:underline"
                  >
                    {post.title}
                  </Link>

                  {/* Category */}
                  <p className="mt-2 text-sm font-medium text-gray-600">
                    {post.category}
                  </p>

                  {/* Tags */}
                  <p className="mt-3 text-sm text-gray-500">
                    {formattedTags}
                  </p>

                  {/* Date */}
                  <p className="mt-2 text-sm text-gray-500">
                    Posted on {formattedDate}
                  </p>

                  <div className="mt-auto pt-5">
                    {/* Assignment 2 only:
                        show a message when clicked */}
                    <button
                      type="button"
                      onClick={() =>
                        setStatusMessage(
                          `Post "${post.title}" is currently ${
                            post.active ? "Active" : "Inactive"
                          }.`,
                        )
                      }
                      className={
                        post.active
                          ? "rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
                          : "rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600"
                      }
                    >
                      {post.active ? "Active" : "Inactive"}
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