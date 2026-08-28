
"use client";

import { useState } from "react";

type LikeButtonProps = {
  postId: number;
  initialLikes: number;
};

export function LikeButton({
  postId,
  initialLikes,
}: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(false);

  async function handleLike() {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to update like");
      }

      const data = (await response.json()) as {
        likes: number;
      };

      setLikes(data.likes);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span>{likes} likes</span>

      <button
        type="button"
        data-test-id="like-button"
        disabled={loading}
        onClick={handleLike}
        className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
      >
        {loading ? "..." : "Like"}
      </button>
    </div>
  );
}