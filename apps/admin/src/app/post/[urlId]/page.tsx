import { posts } from "@repo/db/data";
import { notFound, redirect } from "next/navigation";

import { PostForm } from "../../../components/PostForm";
import { isLoggedIn } from "../../../utils/auth";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  // Assignment 2:
  // only logged-in users can access this page.
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    // Send logged-out users back to the login screen.
    redirect("/");
  }

  // Get the post id from the URL.
  // Example:
  // /post/no-front-end-framework-is-the-best
  const { urlId } = await params;

  // Find the matching post.
  const post = posts.find(
    (item) => item.urlId === urlId,
  );

  // If the post does not exist, show a 404 page.
  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      {/* Preload the selected post into the update form */}
      <PostForm post={post} />
    </main>
  );
}