import { expect, test } from "./fixtures";

test.describe("RICH TEXT EDITOR", () => {
  test(
    "saves formatting and displays it after reopening",
    { tag: "@rich-text" },
    async ({ userPage, page }) => {
      // Allow time for Next.js to compile during development.
      test.setTimeout(60_000);

      const adminUrl = "http://localhost:3002";
      const publicUrl = "http://localhost:3001";

      // A unique title prevents duplicate post URLs between runs.
      const title = `Editor E2E ${Date.now()}`;
      const sentence = "This formatting should survive saving.";

      // Load the admin page using the saved login cookies.
      await userPage.goto(adminUrl);

      await expect(
        userPage.getByRole("button", {
          name: "Logout",
          exact: true,
        }),
      ).toBeVisible();

      // Create Post is a navigation link styled as a button.
      await userPage
        .getByRole("link", {
          name: "Create Post",
          exact: true,
        })
        .click();

      await expect(userPage).toHaveURL(
        `${adminUrl}/posts/create`,
      );

      // Fill all required fields.
      await userPage
        .getByLabel("Title", { exact: true })
        .fill(title);

      await userPage
        .getByLabel("Category", { exact: true })
        .fill("Testing");

      await userPage
        .getByLabel("Description", { exact: true })
        .fill("An automated check of saved rich text formatting.");

      await userPage
        .getByLabel("Tags", { exact: true })
        .fill("Testing,Editor");

      await userPage
        .getByLabel("Image URL", { exact: true })
        .fill("https://example.com/editor-test.jpg");

      // Open the visual editor and enter the test sentence.
      await userPage
        .getByRole("button", {
          name: "Visual editor",
          exact: true,
        })
        .click();

      const editor = userPage.getByRole("textbox", {
        name: "Rich text content",
        exact: true,
      });

      await editor.fill(sentence);

      // Select the editor text and apply bold formatting.
      await editor.press("ControlOrMeta+a");

      await userPage
        .getByRole("button", {
          name: "Bold",
          exact: true,
        })
        .click();

      await expect(editor.locator("strong")).toHaveText(
        sentence,
      );

      // Check that visual formatting converts to Markdown.
      await userPage
        .getByRole("button", {
          name: "Markdown",
          exact: true,
        })
        .click();

      await expect(
        userPage.getByLabel("Content", { exact: true }),
      ).toHaveValue(`**${sentence}**`);

      // Save the post through the real application.
      await userPage
        .getByRole("button", {
          name: "Save",
          exact: true,
        })
        .click();

      await expect(
        userPage.getByText("Post updated successfully", {
          exact: true,
        }),
      ).toBeVisible();

      // Return to the list and reopen the saved post.
      await userPage.goto(adminUrl);

      const savedPostLink = userPage.getByRole("link", {
        name: title,
        exact: true,
      });

      await expect(savedPostLink).toBeVisible();
      await savedPostLink.click();

      await expect(userPage).toHaveURL(/\/post\/[^/?]+$/);

      // Use the actual saved URL for the public-page check.
      const postPath = new URL(userPage.url()).pathname;

      // Verify that Markdown survived saving and reopening.
      await expect(
        userPage.getByLabel("Content", { exact: true }),
      ).toHaveValue(`**${sentence}**`);

      await userPage
        .getByRole("button", {
          name: "Visual editor",
          exact: true,
        })
        .click();

      // Verify that the reopened visual editor shows bold text.
      await expect(
        userPage
          .getByRole("textbox", {
            name: "Rich text content",
            exact: true,
          })
          .locator("strong"),
      ).toHaveText(sentence);

      // Check the same post on the public website.
      await page.goto(`${publicUrl}${postPath}`);

      await expect(
        page
          .getByTestId("content-markdown")
          .locator("strong"),
      ).toHaveText(sentence);
    },
  );
});