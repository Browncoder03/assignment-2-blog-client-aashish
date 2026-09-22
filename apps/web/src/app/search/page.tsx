import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getActivePosts } from "@/functions/posts";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
};

export default async function Page({
  searchParams,
}: SearchPageProps) {
  // Get the search text and pagination page from the URL.
  // Example: /search?q=Fat&page=2
  const {
    q = "",
    page,
  } = await searchParams;

  // Remove extra spaces and make the search lowercase
  // so the search is case-insensitive.
  const searchQuery = q.trim().toLowerCase();

  // Convert the page query into a valid positive number.
  const parsedPage = Number(page);

  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 0
      ? parsedPage
      : 1;

  // Load active posts from the real database.
  const activePosts = await getActivePosts();

  // Filter the posts on the server before passing
  // the matching results into the blog list.
  const filteredPosts = activePosts.filter((post) => {
    // An empty search displays all active posts.
    if (!searchQuery) {
      return true;
    }

    const title = post.title.toLowerCase();
    const description = post.description.toLowerCase();

    return (
      title.includes(searchQuery) ||
      description.includes(searchQuery)
    );
  });

  return (
    <AppLayout query={q}>
      {/* Visual banner describing the current search */}
      <section className="rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-950 to-slate-700 px-6 py-5 text-white shadow-sm dark:border-gray-700">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">
          Search results
        </p>

        <h1 className="mt-1 text-2xl font-bold">
          {searchQuery
            ? `Results for “${q.trim()}”`
            : "All articles"}
        </h1>

        <p className="mt-1 text-sm text-blue-100">
          {filteredPosts.length}{" "}
          {filteredPosts.length === 1 ? "article" : "articles"} found
        </p>
      </section>

      {/* Display the selected page of matching search results */}
      <Main
        posts={filteredPosts}
        currentPage={currentPage}
      />
    </AppLayout>
  );
}