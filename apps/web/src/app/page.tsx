import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";

import { getActivePosts } from "@/functions/posts";

import styles from "./page.module.css";

type HomeProps = {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
  }>;
};

export default async function Home({
  searchParams,
}: HomeProps) {
  // Read pagination settings from the URL.
  // Example: /?page=2&pageSize=3
  const {
    page,
    pageSize,
  } = await searchParams;

  const parsedPage = Number(page);
  const parsedPageSize = Number(pageSize);

  // Use page 1 when the URL contains a missing,
  // invalid, decimal, or negative page number.
  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 0
      ? parsedPage
      : 1;

  // The BlogList validates this value and falls back
  // to three posts if it is missing or invalid.
  const postsPerPage = parsedPageSize;

  // Load only active posts from the real database.
  // New posts created through the admin can appear here.
  const activePosts = await getActivePosts();

  return (
    <AppLayout>
      <Main
        posts={activePosts}
        currentPage={currentPage}
        postsPerPage={postsPerPage}
        className={styles.main}
      />
    </AppLayout>
  );
}