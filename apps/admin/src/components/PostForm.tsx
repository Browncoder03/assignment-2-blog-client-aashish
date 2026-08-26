"use client";

import type { Post } from "@repo/db/data";
import { useRef, useState } from "react";

type PostFormProps = {
  post?: Post;
};

type FormErrors = {
  title?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  tags?: string;
};

// Small Markdown renderer for Assignment 2 preview.
//
// The supplied post content uses Markdown such as:
// **sint voluptas**
//
// This converts that into:
// <strong>sint voluptas</strong>
function renderMarkdown(markdown: string) {
  return markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br />");
}

export function PostForm({ post }: PostFormProps) {
  // If a post is supplied, this is the update screen.
  // Otherwise, it is the create screen.
  const [title, setTitle] = useState(post?.title ?? "");
  const [category, setCategory] = useState(post?.category ?? "");
  const [description, setDescription] = useState(
    post?.description ?? "",
  );
  const [content, setContent] = useState(post?.content ?? "");
  const [tags, setTags] = useState(post?.tags ?? "");
  const [imageUrl, setImageUrl] = useState(post?.imageUrl ?? "");

  // Store validation errors here.
  const [errors, setErrors] = useState<FormErrors>({});

  // General error shown when Save is clicked
  // and one or more fields are invalid.
  const [showSaveError, setShowSaveError] = useState(false);

  // Controls whether Markdown preview is open.
  const [showPreview, setShowPreview] = useState(false);

  // Reference to the Content textarea.
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Remember where the cursor was before opening preview.
  const cursorPosition = useRef({
    start: 0,
    end: 0,
  });

  function validateForm() {
    const newErrors: FormErrors = {};

    // -------------------------------------------------------
    // TITLE VALIDATION
    // -------------------------------------------------------
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    // -------------------------------------------------------
    // DESCRIPTION VALIDATION
    // -------------------------------------------------------
    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.length > 200) {
      newErrors.description =
        "Description is too long. Maximum is 200 characters";
    }

    // -------------------------------------------------------
    // CONTENT VALIDATION
    // -------------------------------------------------------
    if (!content.trim()) {
      newErrors.content = "Content is required";
    }

    // -------------------------------------------------------
    // IMAGE URL VALIDATION
    // -------------------------------------------------------
    if (!imageUrl.trim()) {
      newErrors.imageUrl = "Image URL is required";
    } else {
      try {
        // URL() throws an error when the text is not a valid URL.
        new URL(imageUrl);
      } catch {
        newErrors.imageUrl = "This is not a valid URL";
      }
    }

    // -------------------------------------------------------
    // TAG VALIDATION
    // -------------------------------------------------------
    if (!tags.trim()) {
      newErrors.tags = "At least one tag is required";
    }

    setErrors(newErrors);

    const hasErrors = Object.keys(newErrors).length > 0;

    // Official Assignment 2 test checks this message.
    setShowSaveError(hasErrors);

    return !hasErrors;
  }

  function handleSave() {
    // Assignment 2 only validates the form.
    //
    // Saving to the database belongs to Assignment 3.
    validateForm();
  }

  function togglePreview() {
    if (!showPreview) {
      // Before opening preview, remember the exact
      // textarea cursor position.
      const textarea = contentRef.current;

      if (textarea) {
        cursorPosition.current = {
          start: textarea.selectionStart,
          end: textarea.selectionEnd,
        };
      }

      setShowPreview(true);
      return;
    }

    // Close the preview and show textarea again.
    setShowPreview(false);

    // Wait until React renders the textarea,
    // then restore the cursor position.
    requestAnimationFrame(() => {
      const textarea = contentRef.current;

      if (textarea) {
        textarea.focus();

        textarea.setSelectionRange(
          cursorPosition.current.start,
          cursorPosition.current.end,
        );
      }
    });
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {post ? "Update Post" : "Create Post"}
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          {post
            ? "Edit the selected blog post."
            : "Create a new blog post."}
        </p>
      </div>

      <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {/* ---------------------------------------------------
            TITLE
            --------------------------------------------------- */}
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Title
          </label>

          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
          />

          {errors.title && (
            <p className="mt-2 text-sm text-red-600">
              {errors.title}
            </p>
          )}
        </div>

        {/* ---------------------------------------------------
            CATEGORY
            --------------------------------------------------- */}
        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Category
          </label>

          <input
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
          />
        </div>

        {/* ---------------------------------------------------
            DESCRIPTION
            --------------------------------------------------- */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Description
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
          />

          <div className="mt-1 flex justify-between text-xs text-gray-400">
            <span>Short description</span>
            <span>{description.length}/200</span>
          </div>

          {errors.description && (
            <p className="mt-2 text-sm text-red-600">
              {errors.description}
            </p>
          )}
        </div>

        {/* ---------------------------------------------------
            CONTENT + MARKDOWN PREVIEW
            --------------------------------------------------- */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Content
            </label>

            {/* Official test checks Preview / Close Preview */}
            <button
              type="button"
              onClick={togglePreview}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {showPreview ? "Close Preview" : "Preview"}
            </button>
          </div>

          {showPreview ? (
            // Render Markdown while preview is open.
            <div
              data-test-id="content-preview"
              className="min-h-48 rounded-lg border border-gray-200 bg-gray-50 p-4 leading-7 text-gray-700"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(content),
              }}
            />
          ) : (
            <textarea
              ref={contentRef}
              id="content"
              value={content}
              onChange={(event) =>
                setContent(event.target.value)
              }
              rows={12}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 font-mono text-sm"
            />
          )}

          {errors.content && (
            <p className="mt-2 text-sm text-red-600">
              {errors.content}
            </p>
          )}
        </div>

        {/* ---------------------------------------------------
            TAGS
            --------------------------------------------------- */}
        <div>
          <label
            htmlFor="tags"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Tags
          </label>

          <input
            id="tags"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="Front-End, Dev Tools"
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
          />

          <p className="mt-1 text-xs text-gray-400">
            Separate tags using commas.
          </p>

          {errors.tags && (
            <p className="mt-2 text-sm text-red-600">
              {errors.tags}
            </p>
          )}
        </div>

        {/* ---------------------------------------------------
            IMAGE URL + IMAGE PREVIEW
            --------------------------------------------------- */}
        <div>
          <label
            htmlFor="image-url"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Image URL
          </label>

          <input
            id="image-url"
            value={imageUrl}
            onChange={(event) =>
              setImageUrl(event.target.value)
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
          />

          {errors.imageUrl && (
            <p className="mt-2 text-sm text-red-600">
              {errors.imageUrl}
            </p>
          )}

          {/* Official Assignment 2 test checks this exact test id */}
          {imageUrl && (
            <img
              data-test-id="image-preview"
              src={imageUrl}
              alt="Post preview"
              className="mt-4 max-h-72 w-full rounded-xl border border-gray-200 object-cover"
            />
          )}
        </div>

        {/* General Save validation error */}
        {showSaveError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Please fix the errors before saving
          </div>
        )}

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}