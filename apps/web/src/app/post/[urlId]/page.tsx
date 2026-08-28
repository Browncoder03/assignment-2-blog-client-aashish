import { client } from "@repo/db/client";
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
  const { urlId } = await params;

  // ---------------------------------------------------------
  // ASSIGNMENT 2.3
  // FIND THE POST IN THE DATABASE
  // ---------------------------------------------------------

  const existingPost = await client.db.post.findUnique({
    where: {
      urlId,
    },
  });

  // Only active posts can be viewed publicly.
  if (!existingPost || !existingPost.active) {
    notFound();
  }

  // ---------------------------------------------------------
  // INCREASE VIEWS
  // ---------------------------------------------------------
  //
  // Every visit to the detail page increases views by 1.
  //
  // Example:
  // 320 -> 321
  // next visit -> 322

  const post = await client.db.post.update({
    where: {
      id: existingPost.id,
    },
    data: {
      views: {
        increment: 1,
      },
    },

    // Count the Like records belonging to this post.
    include: {
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  // Convert the Prisma post into the shape BlogDetail needs.
  const detailPost = {
    id: post.id,
    urlId: post.urlId,
    title: post.title,
    content: post.content,
    category: post.category,
    description: post.description,
    imageUrl: post.imageUrl,
    tags: post.tags,
    active: post.active,
    date: post.date,
    views: post.views,

    // Likes are now stored as rows in the Like table.
    likes: post._count.likes,
  };

  return (
    <AppLayout>
      <BlogDetail post={detailPost} />
    </AppLayout>
  );
}