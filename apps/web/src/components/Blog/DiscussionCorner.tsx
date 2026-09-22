"use client";

import {
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";

import {
  createComment,
  type DiscussionComment,
} from "@/app/comment-actions";

type DiscussionCornerProps = {
  postId: number;
  initialComments: DiscussionComment[];
};

// Initials give each comment a simple avatar without image uploads.
function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

// An explicit timezone keeps server and browser output consistent.
function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function DiscussionCorner({
  postId,
  initialComments,
}: DiscussionCornerProps) {
  const formId = useId();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const submittingRef = useRef(false);

  const [comments, setComments] = useState(initialComments);
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] =
    useState<DiscussionComment | null>(null);

  const [collapsed, setCollapsed] = useState<Set<number>>(
    () => new Set(),
  );

  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Group replies by parent once per render.
  const repliesByParent = new Map<number, DiscussionComment[]>();
  const rootComments: DiscussionComment[] = [];

  for (const comment of comments) {
    if (comment.parentId === null) {
      rootComments.push(comment);
    } else {
      const replies = repliesByParent.get(comment.parentId) ?? [];
      replies.push(comment);
      repliesByParent.set(comment.parentId, replies);
    }
  }

  function startReply(comment: DiscussionComment) {
    setReplyTo(comment);
    setError("");
    setNotice("");

    contentRef.current?.focus();
    contentRef.current?.scrollIntoView({
      block: "center",
    });
  }

  function toggleReplies(commentId: number) {
    setCollapsed((previous) => {
      const next = new Set(previous);

      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }

      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Prevent duplicate submissions while a request is running.
    if (submittingRef.current) return;

    submittingRef.current = true;
    setPending(true);
    setError("");
    setNotice("");

    const formData = new FormData();
    formData.set("postId", String(postId));
    formData.set("authorName", authorName);
    formData.set("content", content);

    if (replyTo) {
      formData.set("parentId", String(replyTo.id));
    }

    try {
      const result = await createComment(formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      const savedComment = result.comment;

      setComments((previous) => [...previous, savedComment]);

      // Open the parent thread so the new reply is visible.
      if (savedComment.parentId !== null) {
        const parentId = savedComment.parentId;

        setCollapsed((previous) => {
          const next = new Set(previous);
          next.delete(parentId);
          return next;
        });
      }

      setContent("");
      setReplyTo(null);
      setNotice(
        savedComment.parentId === null
          ? "Your comment has been posted."
          : "Your reply has been posted.",
      );
    } catch {
      // Keep the draft if the network request fails.
      setError("Unable to connect. Your draft is still here. Try again.");
    } finally {
      submittingRef.current = false;
      setPending(false);
    }
  }

  function renderComment(
    comment: DiscussionComment,
    depth = 0,
  ): React.ReactNode {
    const replies = repliesByParent.get(comment.id) ?? [];
    const isCollapsed = collapsed.has(comment.id);
    const threadId = `${formId}-replies-${comment.id}`;

    return (
      <li key={comment.id}>
        <article
          data-test-id={`discussion-comment-${comment.id}`}
          className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-800 dark:bg-teal-900 dark:text-teal-100"
            >
              {getInitials(comment.authorName)}
            </span>

            <div className="min-w-0">
              <p className="break-words font-semibold text-gray-900 dark:text-gray-100">
                {comment.authorName}
              </p>

              <time
                dateTime={comment.createdAt}
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                {formatDate(comment.createdAt)}
              </time>
            </div>
          </div>

          {/* React displays comments as text, not executable HTML. */}
          <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-gray-700 dark:text-gray-300">
            {comment.content}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <button
              type="button"
              disabled={pending}
              onClick={() => startReply(comment)}
              aria-label={`Reply to ${comment.authorName}`}
              className="rounded text-sm font-semibold text-teal-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 disabled:opacity-50 dark:text-teal-300"
            >
              Reply
            </button>

            {replies.length > 0 && (
              <button
                type="button"
                onClick={() => toggleReplies(comment.id)}
                aria-expanded={!isCollapsed}
                aria-controls={threadId}
                className="rounded text-sm text-gray-500 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 dark:text-gray-400 dark:hover:text-white"
              >
                {isCollapsed ? "Show" : "Hide"} {replies.length}{" "}
                {replies.length === 1 ? "reply" : "replies"}
              </button>
            )}
          </div>
        </article>

        {replies.length > 0 && (
          <ul
            id={threadId}
            hidden={isCollapsed}
            className={`mt-3 space-y-3 border-l-2 border-teal-200 pl-3 dark:border-teal-900 ${
              depth < 2 ? "ml-4 sm:ml-6" : ""
            }`}
          >
            {/* Limit extra indentation so threads remain readable. */}
            {replies.map((reply) => renderComment(reply, depth + 1))}
          </ul>
        )}
      </li>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100";

  return (
    <section
      aria-labelledby={`${formId}-heading`}
      data-test-id="discussion-corner"
      className="mx-auto mt-6 mb-12 max-w-4xl rounded-3xl border border-gray-200 bg-gray-50 p-5 sm:p-8 dark:border-gray-800 dark:bg-gray-950"
    >
      <header className="mb-7">
        <p className="text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-300">
          A place for another perspective
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h2
            id={`${formId}-heading`}
            className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white"
          >
            Discussion Corner
          </h2>

          <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800 dark:bg-teal-900 dark:text-teal-100">
            {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
          Ask a question, share an experience, or add a different view.
          Keep it thoughtful and respectful.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        aria-label="Add to the discussion"
        aria-busy={pending}
        className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-900"
      >
        {replyTo && (
          <div className="mb-5 rounded-xl border-l-4 border-teal-500 bg-teal-50 p-4 dark:bg-teal-950">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-teal-900 dark:text-teal-100">
                Replying to {replyTo.authorName}
              </p>

              <button
                type="button"
                disabled={pending}
                onClick={() => setReplyTo(null)}
                className="shrink-0 rounded text-sm text-teal-800 underline disabled:opacity-50 dark:text-teal-200"
              >
                Cancel reply
              </button>
            </div>

            <p className="mt-2 line-clamp-2 break-words text-sm text-teal-800 dark:text-teal-200">
              {replyTo.content}
            </p>
          </div>
        )}

        <label
          htmlFor={`${formId}-name`}
          className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200"
        >
          Display name
        </label>

        <input
          id={`${formId}-name`}
          name="authorName"
          value={authorName}
          onChange={(event) => setAuthorName(event.target.value)}
          minLength={2}
          maxLength={40}
          required
          disabled={pending}
          autoComplete="nickname"
          placeholder="What should we call you?"
          className={inputClass}
        />

        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          This name will appear publicly. No account is required.
        </p>

        <label
          htmlFor={`${formId}-content`}
          className="mt-5 mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200"
        >
          {replyTo ? "Your reply" : "Your comment"}
        </label>

        <textarea
          ref={contentRef}
          id={`${formId}-content`}
          name="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={2000}
          required
          disabled={pending}
          rows={4}
          aria-describedby={`${formId}-count`}
          placeholder="What stood out to you?"
          className={`${inputClass} resize-y`}
        />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <span
            id={`${formId}-count`}
            className="text-xs text-gray-500 dark:text-gray-400"
          >
            {content.length}/2,000 characters
          </span>

          <button
            type="submit"
            disabled={
              pending ||
              authorName.trim().length < 2 ||
              content.trim().length === 0
            }
            className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending
              ? "Posting…"
              : replyTo
                ? "Post reply"
                : "Post comment"}
          </button>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <p
          role="status"
          aria-live="polite"
          className="mt-3 text-sm text-teal-700 dark:text-teal-300"
        >
          {notice}
        </p>
      </form>

      {comments.length === 0 ? (
        <div className="py-10 text-center">
          <p className="font-semibold text-gray-800 dark:text-gray-200">
            Every conversation starts with one thought.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Be the first to share yours.
          </p>
        </div>
      ) : (
        <ul aria-label="Comments" className="mt-7 space-y-5">
          {rootComments.map((comment) => renderComment(comment))}
        </ul>
      )}
    </section>
  );
}