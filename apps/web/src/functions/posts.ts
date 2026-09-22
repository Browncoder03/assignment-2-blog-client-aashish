import { client } from "@repo/db/client";
import type { Post } from "@repo/db/data";

/**
 * Loads all active posts from the database for the public website.
 *
 * Likes are stored in a separate database table, so Prisma counts
 * the related Like records and converts the result into the number
 * expected by the existing Post type.
 */
export async function getActivePosts(): Promise<Post[]> {
  const databasePosts = await client.db.post.findMany({
    where: {
      active: true,
    },

    // Display the newest articles first.
    orderBy: {
      date: "desc",
    },

    // Count the likes connected to each post.
    include: {
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  // Convert Prisma's result into the Post shape used
  // by the existing blog components.
  return databasePosts.map((post) => ({
    id: post.id,
    urlId: post.urlId,
    title: post.title,
    content: post.content,
    description: post.description,
    imageUrl: post.imageUrl,
    date: post.date,
    category: post.category,
    views: post.views,
    likes: post._count.likes,
    tags: post.tags,
    active: post.active,
  }));
}