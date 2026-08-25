export function categories(
  posts: { category: string; active: boolean }[],
): { name: string; count: number }[] {
  return posts
    // Only use active posts
    .filter((post) => post.active)

    // Sort categories alphabetically
    .sort((a, b) => a.category.localeCompare(b.category))

    // Count how many posts belong to each category
    .reduce(
      (acc, post) => {
        const existingCategory = acc.find(
          (item) => item.name === post.category,
        );

        if (existingCategory) {
          existingCategory.count++;
        } else {
          acc.push({
            name: post.category,
            count: 1,
          });
        }

        return acc;
      },
      [] as { name: string; count: number }[],
    );
}