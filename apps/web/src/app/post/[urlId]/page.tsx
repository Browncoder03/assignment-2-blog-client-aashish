import { client } from "@repo/db/client";
import { notFound } from "next/navigation";

import { BlogDetail } from "@/components/Blog/Detail";
import { DiscussionCorner } from "@/components/Blog/DiscussionCorner";
import { AppLayout } from "@/components/Layout/AppLayout";

// Read current database data whenever this page is requested.
export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;

  const existingPost = await client.db.post.findUnique({
    where: { urlId },
  });

  // Only active posts can be viewed publicly.
  if (!existingPost || !existingPost.active) {
    notFound();
  }

  // Preserve the existing view counter and likes count.
  const post = await client.db.post.update({
    where: {
      id: existingPost.id,
    },
    data: {
      views: {
        increment: 1,
      },
    },
    include: {
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  // Load both top-level comments and replies.
  // The discussion component groups replies under their parents.
  const comments = await client.db.comment.findMany({
    where: {
      postId: post.id,
    },
    orderBy: [
      { createdAt: "asc" },
      { id: "asc" },
    ],
    select: {
      id: true,
      postId: true,
      parentId: true,
      authorName: true,
      content: true,
      createdAt: true,
    },
  });

  // Convert database dates to strings for the client component.
  const initialComments = comments.map((comment) => ({
    ...comment,
    createdAt: comment.createdAt.toISOString(),
  }));

  // Keep the data format expected by BlogDetail.
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
    likes: post._count.likes,
  };

  return (
    <AppLayout>
      <BlogDetail post={detailPost} />

      <DiscussionCorner
        key={post.id}
        postId={post.id}
        initialComments={initialComments}
      />
    </AppLayout>
  );
}