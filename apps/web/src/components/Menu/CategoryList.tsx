import { categories } from "@/functions/categories";
import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";

import { SummaryItem } from "./SummaryItem";

export function CategoryList({
  posts,
  selectedCategory,
}: {
  posts: Post[];
  selectedCategory?: string;
}) {
  return (
    <>
      {categories(posts).map((item) => {
        // Convert the category name into a URL-friendly value.
        // Example: "Front End" -> "front-end"
        const categoryPath = toUrlPath(item.name);

        return (
          <SummaryItem
            // React needs a unique key for items created with map()
            key={item.name}

            // Category name shown in the sidebar
            name={item.name}

            // Number of active posts in this category
            count={item.count}

            // Highlight this category when it matches the current URL
            isSelected={selectedCategory === categoryPath}

            // Example: /category/react
            link={`/category/${categoryPath}`}

            // Official Assignment 2.1 Playwright test checks this title
            title={`Category / ${item.name}`}
          />
        );
      })}
    </>
  );
}