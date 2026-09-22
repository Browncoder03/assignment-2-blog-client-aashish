import type { Post } from "@repo/db/data";

import BlogList from "./Blog/List";

type MainProps = {
  posts: Post[];
  className?: string;

  // Current pagination page taken from the URL.
  currentPage?: number;

  // Optional number of posts displayed per page.
  // The blog list uses three when this is not supplied.
  postsPerPage?: number;
};

export function Main({
  posts,
  className,
  currentPage = 1,
  postsPerPage,
}: MainProps) {
  return (
    <main className={className}>
      {/* Send the pagination settings to the blog list */}
      <BlogList
        posts={posts}
        currentPage={currentPage}
        postsPerPage={postsPerPage}
      />
    </main>
  );
}