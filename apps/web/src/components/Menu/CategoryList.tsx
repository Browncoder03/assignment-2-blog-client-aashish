import { categories } from "@/functions/categories";
import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";

import { SummaryItem } from "./SummaryItem";

export function CategoryList({ posts }: { posts: Post[] }) {
  // categories(posts) gives us something like:
  // [
  //   { name: "React", count: 2 },
  //   { name: "Node", count: 3 }
  // ]

  return (
    <>
      {categories(posts).map((item) => (
        <SummaryItem
          // React needs a unique key when we use .map()
          key={item.name}

          // Number of posts in this category
          count={item.count}

          // Category name, for example "React"
          name={item.name}

          // We will deal with selected categories later
          isSelected={false}

          // Converts a category into a URL
          // Example: "Front End" -> /category/front-end
          link={`/category/${toUrlPath(item.name)}`}

          // Text shown when hovering over the link
          title={`View ${item.name} posts`}
        />
      ))}
    </>
  );
}