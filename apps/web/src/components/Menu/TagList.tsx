import { type Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";

import { tags } from "../../functions/tags";

import { SummaryItem } from "./SummaryItem";

export async function TagList({
  selectedTag,
  posts,
}: {
  selectedTag?: string;
  posts: Post[];
}) {
  // Get all active tags and their post counts
  const postTags = await tags(posts);

  return (
    <>
      {postTags.map((tag) => (
        <SummaryItem
          // Unique key for React
          key={tag.name}

          // Tag name
          name={tag.name}

          // Number of posts using this tag
          count={tag.count}

          // Highlight this tag when it is selected
          isSelected={selectedTag === toUrlPath(tag.name)}

          // IMPORTANT:
          // Official Assignment 2.1 test expects /tags/... not /tag/...
          link={`/tags/${toUrlPath(tag.name)}`}

          // Official Playwright test checks this title
          title={`Tag / ${tag.name}`}
        />
      ))}
    </>
  );
}