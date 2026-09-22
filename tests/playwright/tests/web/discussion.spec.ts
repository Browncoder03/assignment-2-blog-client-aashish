import { expect, test } from "@playwright/test";

test.describe("DISCUSSION CORNER", () => {
  test(
    "saves a comment and reply and preserves them after refresh",
    { tag: "@discussion" },
    async ({ page }) => {
      // Use the public blog.
      await page.goto("http://localhost:3001/");

      // Open the first available post.
      const postLink = page.locator('a[href^="/post/"]').first();

      await expect(postLink).toBeVisible();
      await postLink.click();

      const discussion = page.locator(
        '[data-test-id="discussion-corner"]',
      );

      await expect(discussion).toBeVisible();

      // Unique text prevents older test comments from matching.
      const uniqueId = `${Date.now()}-${test.info().workerIndex}`;
      const authorName = "Discussion Tester";
      const commentText = `A new discussion ${uniqueId}`;
      const replyText = `A reply to that discussion ${uniqueId}`;

      // Create a top-level comment.
      await discussion.getByLabel("Display name").fill(authorName);

      await discussion
        .getByLabel("Your comment", { exact: true })
        .fill(commentText);

      await discussion
        .getByRole("button", {
          name: "Post comment",
          exact: true,
        })
        .click();

      await expect(discussion.getByRole("status")).toHaveText(
        "Your comment has been posted.",
      );

      // Each comment has its own article element.
      const parentComment = discussion
        .locator('article[data-test-id^="discussion-comment-"]')
        .filter({ hasText: commentText });

      await expect(parentComment).toBeVisible();

      // Reply specifically to the comment we just created.
      await parentComment
        .getByRole("button", {
          name: `Reply to ${authorName}`,
          exact: true,
        })
        .click();

      await expect(
        discussion.getByText(`Replying to ${authorName}`, {
          exact: true,
        }),
      ).toBeVisible();

      await discussion
        .getByLabel("Your reply", { exact: true })
        .fill(replyText);

      await discussion
        .getByRole("button", {
          name: "Post reply",
          exact: true,
        })
        .click();

      await expect(discussion.getByRole("status")).toHaveText(
        "Your reply has been posted.",
      );

      // Refresh to verify the records were saved in the database.
      await page.reload();

      await expect(parentComment).toBeVisible();

      const savedReply = discussion.getByText(replyText, {
        exact: true,
      });

      await expect(savedReply).toBeVisible();

      // Collapsing this parent should hide its reply.
      await parentComment
        .getByRole("button", {
          name: "Hide 1 reply",
          exact: true,
        })
        .click();

      await expect(savedReply).toBeHidden();

      // Expanding the thread should show the reply again.
      await parentComment
        .getByRole("button", {
          name: "Show 1 reply",
          exact: true,
        })
        .click();

      await expect(savedReply).toBeVisible();
    },
  );
});