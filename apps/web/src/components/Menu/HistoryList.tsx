import { history } from "@/functions/history";
import { type Post } from "@repo/db/data";

import { SummaryItem } from "./SummaryItem";

// Month number -> month name
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
  // Get the history data from our history() function
  const historyItems = history(posts);

  return (
    <>
      {historyItems.map((item) => {
        // Example: item.month = 5 -> "May"
        const monthName = months[item.month];

        // Check if this history item is currently selected
        const isSelected =
          selectedYear === item.year.toString() &&
          selectedMonth === item.month.toString();

        return (
          <SummaryItem
            key={`${item.year}-${item.month}`}
            name={`${monthName}, ${item.year}`}
            count={item.count}
            isSelected={isSelected}
            link={`/history/${item.year}/${item.month}`}
            title={`View posts from ${monthName} ${item.year}`}
          />
        );
      })}
    </>
  );
}