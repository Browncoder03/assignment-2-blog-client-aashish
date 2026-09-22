"use server";

import { client } from "@repo/db/client";

// Plain data that can be returned to the discussion component.
export type DiscussionComment = {
  id: number;
  postId: number;
  parentId: number | null;
  authorName: string;
  content: string;
  createdAt: string;
};

// The form receives either a saved comment or a helpful error.
export type CreateCommentResult =
  | {
      success: true;
      comment: DiscussionComment;
    }
  | {
      success: false;
      error: string;
    };

export async function createComment(
  formData: FormData,
): Promise<CreateCommentResult> {
  // Validate on the server because browser checks can be bypassed.
  if (!(formData instanceof FormData)) {
    return {
      success: false,
      error: "Invalid submission. Please try again.",
    };
  }

  const rawPostId = formData.get("postId");
  const rawParentId = formData.get("parentId");
  const rawName = formData.get("authorName");
  const rawContent = formData.get("content");

  if (
    typeof rawPostId !== "string" ||
    typeof rawName !== "string" ||
    typeof rawContent !== "string"
  ) {
    return {
      success: false,
      error: "Please enter your name and comment.",
    };
  }

  const postId = Number(rawPostId);
  const authorName = rawName.trim();
  const content = rawContent.trim();

  if (!Number.isSafeInteger(postId) || postId <= 0) {
    return {
      success: false,
      error: "This post could not be identified.",
    };
  }

  if (authorName.length < 2 || authorName.length > 40) {
    return {
      success: false,
      error: "Your name must contain between 2 and 40 characters.",
    };
  }

  if (content.length < 1 || content.length > 2000) {
    return {
      success: false,
      error: "Your comment must contain between 1 and 2,000 characters.",
    };
  }

  // A missing parent means this starts a new discussion.
  let parentId: number | null = null;

  if (rawParentId !== null && rawParentId !== "") {
    if (typeof rawParentId !== "string") {
      return {
        success: false,
        error: "Invalid reply. Please select the comment again.",
      };
    }

    parentId = Number(rawParentId);

    if (!Number.isSafeInteger(parentId) || parentId <= 0) {
      return {
        success: false,
        error: "Invalid reply. Please select the comment again.",
      };
    }
  }

  try {
    // Check the post and parent inside the same transaction
    // used to save the comment.
    return await client.db.$transaction(
      async (db): Promise<CreateCommentResult> => {
        const post = await db.post.findUnique({
          where: { id: postId },
          select: {
            id: true,
            active: true,
          },
        });

        // Public discussions are available only on active posts.
        if (!post || !post.active) {
          return {
            success: false,
            error: "This post is no longer available for comments.",
          };
        }

        if (parentId !== null) {
          const parent = await db.comment.findUnique({
            where: { id: parentId },
            select: {
              id: true,
              postId: true,
            },
          });

          // Prevent attaching a reply to another post's discussion.
          if (!parent || parent.postId !== postId) {
            return {
              success: false,
              error:
                "The comment you are replying to is no longer available.",
            };
          }
        }

        const comment = await db.comment.create({
          data: {
            postId,
            parentId,
            authorName,
            content,
          },
          select: {
            id: true,
            postId: true,
            parentId: true,
            authorName: true,
            content: true,
            createdAt: true,
          },
        });

        // Return the saved record so the interface can display it
        // without refreshing the article and increasing its views.
        return {
          success: true,
          comment: {
            ...comment,
            createdAt: comment.createdAt.toISOString(),
          },
        };
      },
    );
  } catch (error) {
    // Keep technical details in the server terminal.
    console.error("Failed to create comment:", error);

    return {
      success: false,
      error: "Unable to save your comment. Please try again.",
    };
  }
}