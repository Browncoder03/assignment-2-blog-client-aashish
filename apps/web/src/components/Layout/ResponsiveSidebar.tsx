"use client";

import {
  useId,
  useState,
  type PropsWithChildren,
} from "react";

// Named export matches the import in AppLayout.tsx.
export function ResponsiveSidebar({
  children,
}: PropsWithChildren) {
  // Start with the menu collapsed on narrow screens.
  const [isOpen, setIsOpen] = useState(false);

  // Connect the toggle button to its menu.
  const menuId = useId();

  return (
    <aside
      aria-label="Blog navigation"
      className="w-full shrink-0 rounded-xl border border-gray-200 bg-white shadow-sm sm:w-44 lg:w-64 dark:border-gray-800 dark:bg-gray-900"
    >
      {/* The toggle is visible only on narrow screens. */}
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((previous) => !previous)}
        className="flex w-full items-center justify-between rounded-xl px-4 py-4 text-left text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 sm:hidden"
      >
        <span>
          {isOpen ? "Close topics" : "Browse topics"}
        </span>

        <span aria-hidden="true">
          {isOpen ? "−" : "+"}
        </span>
      </button>

      {/*
        Render the menu once.
        On wider screens, it stays visible beside the article.
      */}
      <div
        id={menuId}
        className={`${
          isOpen ? "block" : "hidden"
        } break-words border-t border-gray-200 p-4 sm:block sm:border-t-0 sm:p-3 lg:p-5 dark:border-gray-800`}
      >
        {children}
      </div>
    </aside>
  );
}