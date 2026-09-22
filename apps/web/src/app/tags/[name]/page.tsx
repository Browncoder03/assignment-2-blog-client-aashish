import { toUrlPath } from "@repo/utils/url";

import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getActivePosts } from "@/functions/posts";

type TagPageProps = {
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
}: TagPageProps) {
  // Get the selected tag from the URL.
  // Example: /tags/dev-tools
  const { name } = await params;

  // Read the pagination page from the query string.
  // Example: /tags/dev-tools?page=2
  const { page } = await searchParams;
  const parsedPage = Number(page);

  // Use page 1 when the page number is missing or invalid.
  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 0
      ? parsedPage
      : 1;

  // Load active posts from the real database.
  const activePosts = await getActivePosts();

  // Filter on the server so the blog list receives
  // only posts containing the selected tag.
  const tagPosts = activePosts.filter((post) => {
    const postTags = post.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    return postTags.some(
      (tag) => toUrlPath(tag) === name,
    );
  });

  // Find the original spelling of the selected tag.
  // Example: "dev-tools" becomes "Dev Tools".
  const matchingTag = activePosts
    .flatMap((post) => {
      return post.tags
        .split(",")
        .map((tag) => tag.trim());
    })
    .find((tag) => toUrlPath(tag) === name);

  const tagLabel =
    matchingTag ??
    name
      .split("-")
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");

  return (
    <AppLayout selectedTag={name}>
      {/* Visual banner showing the currently selected tag */}
      <section className="rounded-2xl border border-gray-200 bg-gradient-to-r from-emerald-950 to-teal-700 px-6 py-5 text-white shadow-sm dark:border-gray-700">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-200">
          Tag
        </p>

        <h1 className="mt-1 text-2xl font-bold">
          #{tagLabel}
        </h1>

        <p className="mt-1 text-sm text-emerald-100">
          {tagPosts.length}{" "}
          {tagPosts.length === 1 ? "article" : "articles"} found
        </p>
      </section>

      {/* Display the selected page of matching tag posts */}
      <Main
        posts={tagPosts}
        currentPage={currentPage}
      />
    </AppLayout>
  );
}