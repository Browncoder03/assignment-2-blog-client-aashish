import { posts } from "@repo/db/data";

import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";

export default async function Page({
  params,
}: {
  params: Promise<{
    year: string;
    month: string;
  }>;
}) {
  // Get the year and month from the URL.
  //
  // Example:
  // /history/2024/12
  //
  // year = "2024"
  // month = "12"
  const { year, month } = await params;

  // URL values are strings,
  // so convert them into numbers for comparison.
  const selectedYear = Number(year);
  const selectedMonth = Number(month);

  // Filter posts by:
  // 1. Active posts only
  // 2. Matching year
  // 3. Matching month
  const historyPosts = posts.filter((post) => {
    // Get the year from the post date.
    const postYear = post.date.getFullYear();

    // JavaScript months start at 0.
    // January = 0, December = 11.
    //
    // Add 1 so it matches normal URL month numbers.
    const postMonth = post.date.getMonth() + 1;

    return (
      post.active &&
      postYear === selectedYear &&
      postMonth === selectedMonth
    );
  });

  return (
    <AppLayout
      // Pass these values to the sidebar
      // so the selected history item can be highlighted.
      selectedYear={year}
      selectedMonth={month}
    >
      {/* Show posts from the selected month and year */}
      <Main posts={historyPosts} />
    </AppLayout>
  );
}