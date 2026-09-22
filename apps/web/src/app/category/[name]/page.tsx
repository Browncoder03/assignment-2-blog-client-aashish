import { toUrlPath } from "@repo/utils/url";

import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getActivePosts } from "@/functions/posts";

type CategoryPageProps = {
  params: Promise<{
    name: string;
  }>;

  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function Page({
  params,
  searchParams,
}: CategoryPageProps) {
  // Get the category name from the URL.
  // Example: /category/react
  const { name } = await params;

  // Get the pagination page from the query string.
  // Example: /category/react?page=2
  const { page } = await searchParams;
  const parsedPage = Number(page);

  // Use page 1 if the supplied value is invalid.
  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 0
      ? parsedPage
      : 1;

  // Load active posts from the real database.
  const activePosts = await getActivePosts();

  // Filter on the server before sending the matching
  // category posts to the blog list.
  const categoryPosts = activePosts.filter((post) => {
    return toUrlPath(post.category) === name;
  });

  // Use the original category spelling when a match exists.
  // Otherwise, convert the URL text into a readable label.
  const categoryLabel =
    categoryPosts[0]?.category ??
    name
      .split("-")
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");

  return (
    <AppLayout selectedCategory={name}>
      {/* Visual banner showing the currently selected category */}
      <section className="rounded-2xl border border-gray-200 bg-gradient-to-r from-violet-950 to-purple-700 px-6 py-5 text-white shadow-sm dark:border-gray-700">
        <p className="text-xs font-semibold uppercase tracking-widest text-purple-200">
          Category
        </p>

        <h1 className="mt-1 text-2xl font-bold">
          {categoryLabel}
        </h1>

        <p className="mt-1 text-sm text-purple-100">
          {categoryPosts.length}{" "}
          {categoryPosts.length === 1 ? "article" : "articles"} found
        </p>
      </section>

      {/* Display the selected page of matching category posts */}
      <Main
        posts={categoryPosts}
        currentPage={currentPage}
      />
    </AppLayout>
  );
}