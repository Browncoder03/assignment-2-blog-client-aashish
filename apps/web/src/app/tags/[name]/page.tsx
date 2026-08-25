import { posts } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";

import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  // Get the selected tag from the URL.
  //
  // Example:
  // /tags/dev-tools
  //
  // name will be:
  // "dev-tools"
  const { name } = await params;

  // Filter the posts so we only show posts
  // that have the selected tag.
  const tagPosts = posts.filter((post) => {
    // Assignment 2.1 only shows active posts.
    if (!post.active) {
      return false;
    }

    // Tags are stored as a comma-separated string.
    //
    // Example:
    // "Front-End, Dev Tools"
    //
    // Split them into individual tags.
    const postTags = post.tags
      .split(",")
      .map((tag) => tag.trim());

    // Convert each tag into URL format.
    //
    // Example:
    // "Dev Tools" -> "dev-tools"
    //
    // Then check whether it matches the URL.
    return postTags.some(
      (tag) => toUrlPath(tag) === name,
    );
  });

  return (
    <AppLayout
      // Tell the sidebar which tag is selected
      // so it can highlight the correct item.
      selectedTag={name}
    >
      {/* Show only posts with the selected tag */}
      <Main posts={tagPosts} />
    </AppLayout>
  );
}