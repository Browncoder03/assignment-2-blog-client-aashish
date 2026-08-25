import { posts } from "@repo/db/data";

import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  // Get the search text from the URL.
  //
  // Example:
  // /search?q=Fat
  //
  // q will be:
  // "Fat"
  const { q = "" } = await searchParams;

  // Remove extra spaces and make the search lowercase.
  // This makes the search case-insensitive.
  //
  // Example:
  // " Fat " -> "fat"
  const searchQuery = q.trim().toLowerCase();

  // Filter posts based on the search text.
  const filteredPosts = posts.filter((post) => {
    // Assignment 2.1 only shows active posts.
    if (!post.active) {
      return false;
    }

    // If the search is empty,
    // show all active posts.
    if (!searchQuery) {
      return true;
    }

    // Convert the title and short description
    // to lowercase before comparing them.
    const title = post.title.toLowerCase();
    const description = post.description.toLowerCase();

    // Assignment requirement:
    // search must match either the title
    // OR the short description.
    return (
      title.includes(searchQuery) ||
      description.includes(searchQuery)
    );
  });

  return (
    <AppLayout
      // Keep the current search text inside the search box.
      query={q}
    >
      {/* Show only posts that match the search */}
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}