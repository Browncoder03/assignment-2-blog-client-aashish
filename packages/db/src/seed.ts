import { client } from "./client.js";
import { posts } from "./data.js";

export async function seed() {
  // Reset the database back to the starter data.
  console.log("🌱 Seeding data");

  // Delete likes first because they depend on posts.
  await client.db.like.deleteMany();

  // Delete all existing posts.
  await client.db.post.deleteMany();

  // Re-create every starter post.
  for (const post of posts) {
    await client.db.post.create({
      data: {
        title: post.title,
        content: post.content,
        category: post.category,
        description: post.description,
        imageUrl: post.imageUrl,

        // Keep tags stored as one clean comma-separated string.
        tags: post.tags
          .split(",")
          .map((tag) => tag.trim())
          .join(","),

        urlId: post.urlId,
        active: post.active,
        date: post.date,
        id: post.id,
        views: post.views,
      },
    });

    // The starter data stores likes as a number.
    // For the database, create that many Like records.
    for (let i = 0; i < post.likes; i++) {
      await client.db.like.create({
        data: {
          postId: post.id,

          // Each fake IP is unique so the composite key works.
          userIP: `192.168.100.${i}`,
        },
      });
    }
  }

  console.log("✅ Database seeded");
}