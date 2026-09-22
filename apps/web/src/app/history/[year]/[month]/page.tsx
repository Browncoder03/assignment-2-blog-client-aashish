import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getActivePosts } from "@/functions/posts";

type HistoryPageProps = {
  params: Promise<{
    year: string;
    month: string;
  }>;

  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function Page({
  params,
  searchParams,
}: HistoryPageProps) {
  // Get the selected year and month from the URL.
  // Example: /history/2024/12
  const { year, month } = await params;

  // Convert the URL values into numbers for comparison.
  const selectedYear = Number(year);
  const selectedMonth = Number(month);

  // Read the pagination page from the query string.
  // Example: /history/2024/12?page=2
  const { page } = await searchParams;
  const parsedPage = Number(page);

  // Use page 1 when the page number is missing or invalid.
  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 0
      ? parsedPage
      : 1;

  // Create a readable label such as "December 2024".
  const archiveDate = new Date(
    selectedYear,
    selectedMonth - 1,
  );

  const archiveLabel = archiveDate.toLocaleDateString("en-AU", {
    month: "long",
    year: "numeric",
  });

  // Load active posts from the real database.
  const activePosts = await getActivePosts();

  // Filter the posts on the server by the selected
  // archive month and year.
  const historyPosts = activePosts.filter((post) => {
    const postYear = post.date.getFullYear();

    // JavaScript starts months at zero, so add one
    // to match the normal month number used in the URL.
    const postMonth = post.date.getMonth() + 1;

    return (
      postYear === selectedYear &&
      postMonth === selectedMonth
    );
  });

  return (
    <AppLayout
      selectedYear={year}
      selectedMonth={month}
    >
      {/* Visual banner showing the selected archive period */}
      <section className="rounded-2xl border border-gray-200 bg-gradient-to-r from-gray-900 to-gray-700 px-6 py-5 text-white shadow-sm dark:border-gray-700">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-300">
          Browsing archive
        </p>

        <h1 className="mt-1 text-2xl font-bold">
          {archiveLabel}
        </h1>

        <p className="mt-1 text-sm text-gray-300">
          {historyPosts.length}{" "}
          {historyPosts.length === 1 ? "article" : "articles"} found
        </p>
      </section>

      {/* Display the selected page of matching history posts */}
      <Main
        posts={historyPosts}
        currentPage={currentPage}
      />
    </AppLayout>
  );
}