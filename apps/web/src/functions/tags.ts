export async function tags(
  posts: { tags: string; active: boolean }[],
): Promise<{ name: string; count: number }[]> {
  return posts
    // Only use active posts
    .filter((post) => post.active)

    // Split comma-separated tags
    // Example: "A,B" becomes ["A", "B"]
    .flatMap((post) =>
      post.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    )

    // Sort tags alphabetically
    .sort((a, b) => a.localeCompare(b))

    // Count how many times each tag appears
    .reduce(
      (acc, tag) => {
        const existingTag = acc.find(
          (item) => item.name === tag,
        );

        if (existingTag) {
          existingTag.count++;
        } else {
          acc.push({
            name: tag,
            count: 1,
          });
        }

        return acc;
      },
      [] as { name: string; count: number }[],
    );
}