"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function createPageUrl(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());

    return `${pathname}?${params.toString()}`;
  }

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Blog pagination"
      className="mt-10 flex items-center justify-center gap-2"
    >
      {currentPage > 1 && (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Previous
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        const selected = page === currentPage;

        return (
          <Link
            key={page}
            href={createPageUrl(page)}
            aria-current={selected ? "page" : undefined}
            className={`rounded-lg border px-4 py-2 text-sm font-medium ${
              selected
                ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900"
                : "border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            {page}
          </Link>
        );
      })}

      {currentPage < totalPages && (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Next
        </Link>
      )}
    </nav>
  );
}