"use client";

import { useEffect, useState } from "react";

export function ReadingTools({ contentId }: { contentId: string }) {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const content = document.getElementById(contentId);
    if (!content) return;

    let frame = 0;
    function update() {
      frame = 0;
      const bounds = content!.getBoundingClientRect();
      const distance = Math.max(1, bounds.height);
      const read = window.innerHeight - bounds.top;
      setProgress(Math.round(Math.min(1, Math.max(0, read / distance)) * 100));
      setShowTop(window.scrollY > 400);
    }
    function scheduleUpdate() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(document.body);
    observer.observe(content);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      observer.disconnect();
    };
  }, [contentId]);

  return (
    <>
      <div
        role="progressbar"
        aria-label="Article reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1 bg-violet-100 dark:bg-violet-950"
      >
        <div
          className="h-full origin-left bg-gradient-to-r from-violet-600 to-fuchsia-500"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>
      {showTop && (
        <button
          type="button"
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches
                ? "instant"
                : "smooth",
            });
          }}
          className="fixed bottom-5 right-5 z-30 inline-flex min-h-11 items-center gap-2 rounded-full bg-violet-700 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-violet-800 dark:bg-violet-600"
        >
          <span aria-hidden="true">&uarr;</span>
          Back to top
        </button>
      )}
    </>
  );
}
