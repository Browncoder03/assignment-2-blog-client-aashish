export function toUrlPath(value: string): string {
  return value
    // Convert text to lowercase
    .toLowerCase()

    // Remove spaces from the beginning and end
    .trim()

    // Replace spaces, symbols and repeated hyphens with one hyphen
    .replace(/[^a-z0-9]+/g, "-")

    // Remove hyphens from the beginning or end
    .replace(/^-+|-+$/g, "");
}