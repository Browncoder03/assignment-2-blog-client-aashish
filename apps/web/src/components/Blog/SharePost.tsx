"use client";

import { useEffect, useId, useState } from "react";

export function SharePost({ title }: { title: string }) {
  const panelId = useId();

  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [canShare, setCanShare] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Share the article itself without search parameters or scroll anchors.
    setUrl(`${window.location.origin}${window.location.pathname}`);

    setCanShare(typeof navigator.share === "function");
  }, []);

  async function copyLink() {
    setBusy(true);
    setMessage("");

    try {
      await navigator.clipboard.writeText(url);

      setMessage("Link copied! Paste it anywhere to share this post.");
    } catch {
      setMessage(
        "Copying is unavailable. Select the link below and copy it manually.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function share() {
    setBusy(true);
    setMessage("");

    try {
      await navigator.share({
        title,
        url,
      });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setMessage("Sharing is unavailable. Use Copy link instead.");
      }
    } finally {
      setBusy(false);
    }
  }

  const buttonClass =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-violet-200 px-4 py-2 text-sm font-semibold text-violet-800 hover:bg-violet-100 disabled:opacity-50 dark:border-violet-800 dark:text-violet-200 dark:hover:bg-violet-900";

  const socialButtonClass =
    "inline-flex h-11 w-11 items-center justify-center rounded-xl border border-violet-200 bg-white text-violet-800 transition hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-200 dark:hover:bg-violet-900";

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedMessage = encodeURIComponent(`${title} ${url}`);

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  const xUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

  const emailUrl = `mailto:?subject=${encodedTitle}&body=${encodedMessage}`;

  return (
    <div className="mt-5">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
        className={buttonClass}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          className="h-5 w-5"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />

          <path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4" />
        </svg>

        Share post
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="mt-3 rounded-2xl border border-violet-200 bg-violet-50 p-5 dark:border-violet-800 dark:bg-violet-950"
      >
        <p className="font-semibold text-violet-900 dark:text-violet-100">
          Good reads are worth sharing.
        </p>

        <p className="mt-1 text-sm text-violet-700 dark:text-violet-300">
          Send this article to someone who would enjoy it.
        </p>

        <label
          htmlFor={`${panelId}-url`}
          className="mt-4 block text-sm font-medium"
        >
          Post link
        </label>

        <input
          id={`${panelId}-url`}
          type="url"
          readOnly
          value={url}
          onFocus={(event) => event.currentTarget.select()}
          className="mt-2 w-full min-w-0 px-3 py-2 text-sm"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy || !url}
            onClick={copyLink}
            className={buttonClass}
          >
            Copy link
          </button>

          {canShare && (
            <button
              type="button"
              disabled={busy || !url}
              onClick={share}
              className={buttonClass}
            >
              Share via device
            </button>
          )}
        </div>

        {/* Social media share buttons */}
        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-violet-900 dark:text-violet-100">
            Share on social media
          </p>

          <div className="flex flex-wrap gap-2">
            {/* Facebook */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Share on Facebook"
              title="Share on Facebook"
              className={socialButtonClass}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.6-1.6h1.7V4.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.2V11H8v3h2.4v8h3.1Z" />
              </svg>
            </a>

            {/* X / Twitter */}
            <a
              href={xUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Share on X"
              title="Share on X"
              className={socialButtonClass}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.25l-4.9-6.74L6.16 22H3.05l7.24-8.27L.8 2h6.4l4.43 6.1L18.9 2Zm-1.1 18h1.73L6.26 3.89H4.4L17.8 20Z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Share on LinkedIn"
              title="Share on LinkedIn"
              className={socialButtonClass}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M6.94 8.5A1.72 1.72 0 1 0 6.94 5a1.72 1.72 0 0 0 0 3.5ZM5.5 9.75H8.4V19H5.5V9.75Zm4.72 0H13v1.26h.04c.39-.74 1.36-1.52 2.8-1.52 2.99 0 3.54 1.97 3.54 4.53V19h-2.9v-4.42c0-1.05-.02-2.41-1.47-2.41-1.47 0-1.7 1.15-1.7 2.34V19h-2.9V9.75Z" />
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Share on WhatsApp"
              title="Share on WhatsApp"
              className={socialButtonClass}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .18 5.3.18 11.83c0 2.08.54 4.1 1.57 5.88L0 24l6.48-1.69a11.9 11.9 0 0 0 5.58 1.42h.01c6.55 0 11.88-5.3 11.88-11.84 0-3.16-1.23-6.12-3.43-8.41ZM12.07 21.7h-.01a9.88 9.88 0 0 1-5.03-1.37l-.36-.22-3.85 1 1.03-3.75-.24-.39a9.8 9.8 0 0 1-1.51-5.17c0-5.44 4.47-9.86 9.97-9.86 2.66 0 5.16 1.03 7.04 2.9a9.78 9.78 0 0 1 2.92 6.97c0 5.44-4.48 9.89-9.96 9.89Z" />
              </svg>
            </a>

            {/* Email */}
            <a
              href={emailUrl}
              aria-label="Share by email"
              title="Share by email"
              className={socialButtonClass}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                className="h-5 w-5"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />

                <path d="m4 7 8 6 8-6" />
              </svg>
            </a>
          </div>
        </div>

        <p
          role="status"
          className="mt-3 text-sm text-violet-800 dark:text-violet-200"
        >
          {message}
        </p>
      </div>
    </div>
  );
}