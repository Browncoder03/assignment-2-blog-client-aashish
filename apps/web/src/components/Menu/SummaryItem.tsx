import Link from "next/link";

export function SummaryItem({
  name,
  link,
  count,
  isSelected,
  title,
}: {
  name: string;
  link: string;
  count: number;
  isSelected: boolean;
  title?: string;
}) {
  return (
    <li>
      <Link
        href={link}
        title={title}
        className={
          isSelected
            ? "selected flex items-center justify-between rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white dark:bg-white dark:text-gray-900"
            : "flex items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        }
      >
        <span>{name}</span>

        <span
          className={
            isSelected
              ? "rounded-full bg-white/20 px-2 py-0.5 text-xs dark:bg-gray-900/10"
              : "rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400"
          }
        >
          {count}
        </span>
      </Link>
    </li>
  );
}