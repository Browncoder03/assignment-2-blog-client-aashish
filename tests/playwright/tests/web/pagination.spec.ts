import { expect, test } from "./fixtures";

test.describe("BLOG PAGINATION", () => {
  test(
    "moves between pages using Next and Previous links",
    {
      tag: "@pagination",
    },
    async ({ page }) => {
      // Use two posts per page so pagination can be tested
      // without directly changing the database.
      await page.goto("/?pageSize=2");

      // Page one must display two posts.
      await expect(
        page.locator('[data-test-id^="blog-post-"]'),
      ).toHaveCount(2);

      // Read the total dynamically because users may have
      // created additional posts through the admin application.
      const totalBadge = page.getByText(/^\d+ Posts$/).first();

      await expect(totalBadge).toBeVisible();

      const totalText = await totalBadge.textContent();
      const totalPosts = Number.parseInt(totalText ?? "0", 10);

      expect(totalPosts).toBeGreaterThanOrEqual(3);

      // Both numbered page links must be visible.
      await expect(
        page.getByRole("link", { name: "1", exact: true }),
      ).toBeVisible();

      await expect(
        page.getByRole("link", { name: "2", exact: true }),
      ).toBeVisible();

      // Move to the second page.
      await page.getByRole("link", { name: "Next" }).click();

      // Wait for the Next.js client-side navigation to finish.
      await expect(page).toHaveURL(
        /[?&]page=2(?:&|$)/,
      );

      const secondPageUrl = new URL(page.url());

      expect(secondPageUrl.searchParams.get("page")).toBe("2");
      expect(secondPageUrl.searchParams.get("pageSize")).toBe("2");

      // Page two displays either one or two posts,
      // depending on the current database total.
      const expectedSecondPageCount = Math.min(
        2,
        totalPosts - 2,
      );

      await expect(
        page.locator('[data-test-id^="blog-post-"]'),
      ).toHaveCount(expectedSecondPageCount);

      // Return to page one.
      await page
        .getByRole("link", { name: "Previous" })
        .click();

      // Wait for the return navigation to finish.
      await expect(page).toHaveURL(
        /[?&]page=1(?:&|$)/,
      );

      const firstPageUrl = new URL(page.url());

      expect(firstPageUrl.searchParams.get("page")).toBe("1");
      expect(firstPageUrl.searchParams.get("pageSize")).toBe("2");

      await expect(
        page.locator('[data-test-id^="blog-post-"]'),
      ).toHaveCount(2);
    },
  );
});