"use client";

import type { Post } from "@repo/db/data";
import Link from "next/link";
import { useLayoutEffect, useRef, useState, useTransition } from "react";

import { createPost, updatePost } from "../app/actions";
import { RichTextEditor } from "./RichTextEditor";

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

// Preserve the existing basic Markdown preview.
// Escape HTML before inserting the supported formatting.
function renderMarkdown(markdown: string) {
  return markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br />");
}

export function PostForm({ post }: PostFormProps) {
  // Existing posts populate the update form.
  // Without a post, the same component creates a new article.
  const [title, setTitle] = useState(post?.title ?? "");
  const [category, setCategory] = useState(post?.category ?? "");
  const [description, setDescription] = useState(
    post?.description ?? "",
  );
  const [content, setContent] = useState(post?.content ?? "");
  const [tags, setTags] = useState(post?.tags ?? "");
  const [imageUrl, setImageUrl] = useState(post?.imageUrl ?? "");

  const [errors, setErrors] = useState<FormErrors>({});
  const [showSaveError, setShowSaveError] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedUrlId, setSavedUrlId] = useState(post?.urlId);
  const [saveError, setSaveError] = useState("");
  const [isPending, startTransition] = useTransition();

  // Both editor modes share the same Markdown content state.
  // Markdown remains the default for the existing textarea tests.
  const [editorMode, setEditorMode] = useState<
    "markdown" | "visual"
  >("markdown");

  const [showPreview, setShowPreview] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Preserve the Markdown selection when opening its preview
  // or temporarily switching to the visual editor.
  const cursorPosition = useRef({
    start: 0,
    end: 0,
  });

  function rememberMarkdownSelection() {
    const textarea = contentRef.current;

    if (textarea) {
      cursorPosition.current = {
        start: textarea.selectionStart,
        end: textarea.selectionEnd,
      };
    }
  }

  // Restore only after returning to the Markdown textarea.
  const pendingSelectionRestore = useRef(false);

  function restoreMarkdownSelection() {
    pendingSelectionRestore.current = true;
  }

  // React has mounted the textarea before this effect runs.
  // Restore its selection before the browser paints.
  useLayoutEffect(() => {
    if (
      !pendingSelectionRestore.current ||
      showPreview ||
      editorMode !== "markdown"
    ) {
      return;
    }

    const textarea = contentRef.current;

    if (!textarea) {
      return;
    }

    textarea.focus({ preventScroll: true });
    textarea.setSelectionRange(
      cursorPosition.current.start,
      cursorPosition.current.end,
    );

    pendingSelectionRestore.current = false;
  }, [showPreview, editorMode]);
  function switchEditorMode(mode: "markdown" | "visual") {
    if (mode === editorMode) {
      return;
    }

    if (editorMode === "markdown") {
      rememberMarkdownSelection();
    }

    setShowPreview(false);
    setEditorMode(mode);

    if (mode === "markdown") {
      restoreMarkdownSelection();
    }
  }

  function togglePreview() {
    if (!showPreview) {
      rememberMarkdownSelection();
      setShowPreview(true);
      return;
    }

    setShowPreview(false);
    restoreMarkdownSelection();
  }

  // Called by either editor whenever the post body changes.
  function handleContentChange(markdown: string) {
    setContent(markdown);
    setSaveSuccess(false);
    setSaveError("");
  }

  function validateForm() {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.length > 200) {
      newErrors.description =
        "Description is too long. Maximum is 200 characters";
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
    }

    if (!imageUrl.trim()) {
      newErrors.imageUrl = "Image URL is required";
    } else {
      try {
        new URL(imageUrl);
      } catch {
        newErrors.imageUrl = "This is not a valid URL";
      }
    }

    if (!tags.trim()) {
      newErrors.tags = "At least one tag is required";
    }

    setErrors(newErrors);

    const hasErrors = Object.keys(newErrors).length > 0;
    setShowSaveError(hasErrors);

    return !hasErrors;
  }

  function handleSave() {
    setSaveSuccess(false);
    setSaveError("");

    if (!validateForm()) {
      return;
    }

    startTransition(async () => {
      try {
        // The visual editor exports Markdown, so both modes
        // save through the existing database actions.
        const postData = {
          title: title.trim(),
          category: category.trim(),
          description: description.trim(),
          content,
          imageUrl: imageUrl.trim(),
          tags: tags.trim(),
        };

        if (post) {
          await updatePost(post.id, postData);
        } else {
          const urlId = await createPost(postData);
          setSavedUrlId(urlId);
        }

        setSaveSuccess(true);
        setShowSaveError(false);
      } catch {
        // Keep the user's draft available if saving fails.
        setSaveError(
          "Unable to save the post. Please try again.",
        );
      }
    });
  }

  const modeButtonClass =
    "rounded-md px-3 py-2 text-sm font-medium transition " +
    "focus-visible:outline focus-visible:outline-2 " +
    "focus-visible:outline-blue-600";

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/"
        className="mb-6 inline-flex rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
      >
        Back to posts
      </Link>

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
        {/* Title */}
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
            onChange={(event) => {
              setTitle(event.target.value);
              setSaveSuccess(false);
            }}
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
          />

          {errors.title && (
            <p className="mt-2 text-sm text-red-600">
              {errors.title}
            </p>
          )}
        </div>

        {/* Category */}
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
            onChange={(event) => {
              setCategory(event.target.value);
              setSaveSuccess(false);
            }}
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
          />
        </div>

        {/* Short description */}
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
            onChange={(event) => {
              setDescription(event.target.value);
              setSaveSuccess(false);
            }}
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

        {/* Content editor */}
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            {editorMode === "markdown" ? (
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                Content
              </label>
            ) : (
              <span className="text-sm font-medium text-gray-700">
                Content
              </span>
            )}

            {/* Accessible toggle buttons select the editing mode. */}
            <div
              role="group"
              aria-label="Editor mode"
              className="flex gap-1 rounded-lg bg-gray-100 p-1"
            >
              <button
                type="button"
                aria-pressed={editorMode === "visual"}
                onClick={() => switchEditorMode("visual")}
                className={`${modeButtonClass} ${
                  editorMode === "visual"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-gray-600 hover:bg-white"
                }`}
              >
                Visual editor
              </button>

              <button
                type="button"
                aria-pressed={editorMode === "markdown"}
                onClick={() => switchEditorMode("markdown")}
                className={`${modeButtonClass} ${
                  editorMode === "markdown"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-gray-600 hover:bg-white"
                }`}
              >
                Markdown
              </button>
            </div>
          </div>

          {editorMode === "visual" ? (
            // Mount with the latest Markdown whenever visual mode opens.
            // Editing here updates the same content state as the textarea.
            <RichTextEditor
              initialContent={content}
              onChange={handleContentChange}
            />
          ) : (
            <>
              <div className="mb-2 flex justify-end">
                <button
                  type="button"
                  onClick={togglePreview}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {showPreview ? "Close Preview" : "Preview"}
                </button>
              </div>

              {showPreview ? (
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
                    handleContentChange(event.target.value)
                  }
                  rows={12}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 font-mono text-sm"
                />
              )}
            </>
          )}

          {errors.content && (
            <p role="alert" className="mt-2 text-sm text-red-600">
              {errors.content}
            </p>
          )}
        </div>

        {/* Tags */}
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
            onChange={(event) => {
              setTags(event.target.value);
              setSaveSuccess(false);
            }}
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

        {/* Image URL and preview */}
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
            onChange={(event) => {
              setImageUrl(event.target.value);
              setSaveSuccess(false);
            }}
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
          />

          {errors.imageUrl && (
            <p className="mt-2 text-sm text-red-600">
              {errors.imageUrl}
            </p>
          )}

          {imageUrl && (
            <img
              data-test-id="image-preview"
              src={imageUrl}
              alt="Post preview"
              className="mt-4 max-h-72 w-full rounded-xl border border-gray-200 object-cover"
            />
          )}
        </div>

        {/* Form validation feedback */}
        {showSaveError && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            Please fix the errors before saving
          </div>
        )}

        {/* Database save failure */}
        {saveError && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {saveError}
          </div>
        )}

        {/* Preserve the success text used by the original tests. */}
        {saveSuccess && (
          <div
            role="status"
            className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            Post updated successfully
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-3">
          {savedUrlId && (
            <>
              <Link
                href={`/post/${encodeURIComponent(savedUrlId)}`}
                className="rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                Open saved post
              </Link>
              {(post?.active ?? true) && (
                <a
                  href={`${(process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3001").replace(/\/$/, "")}/post/${encodeURIComponent(savedUrlId)}`}
                  className="rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
                >
                  View on blog
                </a>
              )}
            </>
          )}
          <button
            type="button"
            disabled={isPending}
            onClick={handleSave}
            className="rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
