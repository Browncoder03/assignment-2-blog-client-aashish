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
      await navigator.share({ title, url });
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
