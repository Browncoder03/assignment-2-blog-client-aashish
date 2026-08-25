import { posts } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";

import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  // Get the category name from the URL.
  // Example:
  // /category/react -> "react"
  const { name } = await params;

  // Filter the posts so we only show:
  // 1. Active posts
  // 2. Posts that belong to the selected category
  const categoryPosts = posts.filter((post) => {
    return (
      post.active &&
      toUrlPath(post.category) === name
    );
  });

  return (
    <AppLayout
      // Pass the selected category to the sidebar
      // so the current category can be highlighted.
      selectedCategory={name}
    >
      {/* Show only posts from the selected category */}
      <Main posts={categoryPosts} />
    </AppLayout>
  );
}