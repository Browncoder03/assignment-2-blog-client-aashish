import type { PropsWithChildren } from "react";

import { Content } from "../Content";
import { LeftMenu } from "../Menu/LeftMenu";
import { TopMenu } from "./TopMenu";

export async function AppLayout({
  children,
  query,
}: PropsWithChildren<{ query?: string }>) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:px-8">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900">
          <LeftMenu />
        </aside>

        {/* Main area */}
        <Content>
          <TopMenu query={query} />

          <div className="mt-6">
            {children}
          </div>
        </Content>
      </div>
    </div>
  );
}