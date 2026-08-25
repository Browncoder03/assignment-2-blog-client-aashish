import { type Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";

import { tags } from "../../functions/tags";

import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";

export async function TagList({
  selectedTag,
  posts,
}: {
  selectedTag?: string;
  posts: Post[];
}) {
  // Get all tags and their post counts
  const postTags = await tags(posts);

  return (
    <LinkList title="Tags">
      {postTags.map((tag) => (
        <SummaryItem
          // Unique key for React
          key={tag.name}

          // Tag name shown in the sidebar
          name={tag.name}

          // Number of posts using this tag
          count={tag.count}

          // Highlight the tag if it is currently selected
          isSelected={selectedTag === tag.name}

          // Build a URL for the tag
          // Example: "Back End" -> /tag/back-end
          link={`/tag/${toUrlPath(tag.name)}`}

          // Text shown when hovering over the link
          title={`View posts tagged ${tag.name}`}
        />
      ))}
    </LinkList>
  );
}