import { history } from "@/functions/history";
import { type Post } from "@repo/db/data";

import { SummaryItem } from "./SummaryItem";

// Convert month numbers into readable month names
const months = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export async function HistoryList({
  selectedYear,
  selectedMonth,
  posts,
}: {
  selectedYear?: string;
  selectedMonth?: string;
  posts: Post[];
}) {
  // Get grouped history data from our history() function
  const historyItems = history(posts);

  return (
    <>
      {historyItems.map((item) => {
        // Example: 12 -> December
        const monthName = months[item.month];

        // Check whether this month/year is currently selected
        const isSelected =
          selectedYear === item.year.toString() &&
          selectedMonth === item.month.toString();

        return (
          <SummaryItem
            // Unique React key
            key={`${item.year}-${item.month}`}

            // Example: December, 2024
            name={`${monthName}, ${item.year}`}

            // Number of posts in this month/year
            count={item.count}

            // Highlight selected history item
            isSelected={isSelected}

            // Example: /history/2024/12
            link={`/history/${item.year}/${item.month}`}

            // Official Playwright test checks this title
            title={`History / ${monthName}, ${item.year}`}
          />
        );
      })}
    </>
  );
}