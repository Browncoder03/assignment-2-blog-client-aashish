import { client } from "@repo/db/client";
import { notFound, redirect } from "next/navigation";

import { PostForm } from "../../../components/PostForm";
import { isLoggedIn } from "../../../utils/auth";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  // Only logged-in users can access the edit page.
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    redirect("/");
  }

  // Read the post's URL identifier.
  const { urlId } = await params;

  // Load the saved post from the database.
  // Admins can edit both active and inactive posts.
  const databasePost = await client.db.post.findUnique({
    where: {
      urlId,
    },
    include: {
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  // Show 404 only when no matching database post exists.
  if (!databasePost) {
    notFound();
  }

  // Convert the database result into the Post shape
  // expected by PostForm, including the numeric like count.
  const post = {
    id: databasePost.id,
    urlId: databasePost.urlId,
    title: databasePost.title,
    content: databasePost.content,
    description: databasePost.description,
    imageUrl: databasePost.imageUrl,
    date: databasePost.date,
    category: databasePost.category,
    views: databasePost.views,
    likes: databasePost._count.likes,
    tags: databasePost.tags,
    active: databasePost.active,
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      {/* Preload the latest saved content into the update form. */}
      <PostForm post={post} />
    </main>
  );
}