import { posts } from "@repo/db/data";

import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  // Get the search text from the URL
  // Example: /search?q=react
  const { q = "" } = await searchParams;

  // Make searching case-insensitive
  const searchQuery = q.trim().toLowerCase();

  // Only show active posts that match the title or description
  const filteredPosts = posts.filter((post) => {
    if (!post.active) {
      return false;
    }

    // If there is no search text, show all active posts
    if (!searchQuery) {
      return true;
    }

    const title = post.title.toLowerCase();
    const description = post.description.toLowerCase();

    return (
      title.includes(searchQuery) ||
      description.includes(searchQuery)
    );
  });

  return (
    <AppLayout query={q}>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}