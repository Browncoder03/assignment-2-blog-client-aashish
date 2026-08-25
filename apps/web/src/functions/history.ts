export function history(
  posts: { date: Date; active: boolean }[],
): { month: number; year: number; count: number }[] {
  return posts
    // Only use active posts
    .filter((post) => post.active)

    // Convert each post date into month/year information
    .map((post) => ({
      // getMonth() starts at 0, so we add 1
      month: post.date.getMonth() + 1,
      year: post.date.getFullYear(),
    }))

    // Count how many posts are in each month/year
    .reduce(
      (acc, item) => {
        const existingHistory = acc.find(
          (historyItem) =>
            historyItem.month === item.month &&
            historyItem.year === item.year,
        );

        if (existingHistory) {
          existingHistory.count++;
        } else {
          acc.push({
            month: item.month,
            year: item.year,
            count: 1,
          });
        }

        return acc;
      },
      [] as { month: number; year: number; count: number }[],
    )

    // Sort from newest to oldest
    .sort((a, b) => {
      if (a.year !== b.year) {
        return b.year - a.year;
      }

      return b.month - a.month;
    });
}