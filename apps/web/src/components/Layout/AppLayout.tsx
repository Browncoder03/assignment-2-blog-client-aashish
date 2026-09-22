import type { PropsWithChildren } from "react";

import { getActivePosts } from "@/functions/posts";

import { Content } from "../Content";
import { LeftMenu } from "../Menu/LeftMenu";
import { ResponsiveSidebar } from "./ResponsiveSidebar";
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
  // Load active database posts for sidebar links and counts.
  const activePosts = await getActivePosts();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 lg:px-8 lg:py-6">
        {/*
          Narrow screens: collapsible menu above the content.
          Split screen and desktop: menu beside the content.
        */}
        <div className="flex flex-col items-start gap-4 sm:flex-row lg:gap-8">
          {/*
            Render LeftMenu once to avoid duplicate links.
            ResponsiveSidebar handles its size and visibility.
          */}
          <ResponsiveSidebar>
            <LeftMenu
              posts={activePosts}
              selectedCategory={selectedCategory}
              selectedTag={selectedTag}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
            />
          </ResponsiveSidebar>

          {/*
            Fill the remaining width.
            min-w-0 allows this column to shrink in split screen.
          */}
          <div className="w-full min-w-0 flex-1">
            <Content>
              {/* Search field and theme switch. */}
              <TopMenu query={query} />

              {/* Display the current page content. */}
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