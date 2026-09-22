import type { PropsWithChildren } from "react";

import { getActivePosts } from "@/functions/posts";

import { Content } from "../Content";
import { LeftMenu } from "../Menu/LeftMenu";
import { TopMenu } from "./TopMenu";

type AppLayoutProps = PropsWithChildren<{
  query?: string;
  selectedCategory?: string;
  selectedTag?: string;
  selectedYear?: string;
  selectedMonth?: string;
}>;

export async function AppLayout({
  children,
  query,
  selectedCategory,
  selectedTag,
  selectedYear,
  selectedMonth,
}: AppLayoutProps) {
  const activePosts = await getActivePosts();

  // Share the same navigation content between both layouts.
  const navigation = (
    <LeftMenu
      posts={activePosts}
      selectedCategory={selectedCategory}
      selectedTag={selectedTag}
      selectedYear={selectedYear}
      selectedMonth={selectedMonth}
    />
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 lg:px-8 lg:py-6">
        {/* Very narrow windows: compact, expandable navigation. */}
        <details className="mb-4 rounded-xl border border-gray-200 bg-white shadow-sm sm:hidden dark:border-gray-800 dark:bg-gray-900">
          <summary className="cursor-pointer rounded-xl px-4 py-4 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600">
            Browse topics
          </summary>

          <div className="border-t border-gray-200 p-4 dark:border-gray-800">
            {navigation}
          </div>
        </details>

        {/* Split screen and desktop: sidebar beside the article. */}
        <div className="flex items-start gap-4 lg:gap-8">
          <aside
            aria-label="Blog navigation"
            className="hidden w-44 shrink-0 break-words rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:block lg:w-64 lg:p-5 dark:border-gray-800 dark:bg-gray-900"
          >
            {navigation}
          </aside>

          {/* min-w-0 allows this column to shrink within the row. */}
          <div className="min-w-0 flex-1">
            <Content>
              <TopMenu query={query} />

              <div className="mt-6 min-w-0">
                {children}
              </div>
            </Content>
          </div>
        </div>
      </div>
    </div>
  );
}