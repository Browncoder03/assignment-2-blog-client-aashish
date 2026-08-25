import { posts } from "@repo/db/data";
import { notFound } from "next/navigation";

import { BlogDetail } from "@/components/Blog/Detail";
import { AppLayout } from "@/components/Layout/AppLayout";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  // Get the post id from the URL.
  //
  // Example:
  // /post/boost-your-conversion-rate
  //
  // urlId will be:
  // "boost-your-conversion-rate"
  const { urlId } = await params;

  // Find the active post that matches the URL.
  const post = posts.find(
    (item) =>
      item.active &&
      item.urlId === urlId,
  );

  // If no matching active post exists,
  // show Next.js 404 page.
  if (!post) {
    notFound();
  }

  return (
    <AppLayout>
      {/* Show the full detail view */}
      <BlogDetail post={post} />
    </AppLayout>
  );
}