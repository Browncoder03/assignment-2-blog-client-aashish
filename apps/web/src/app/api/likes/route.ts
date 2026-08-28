import { client } from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

// Assignment 2.3:
// clicking Like toggles between like and unlike.
// One IP can like one post only once.

export async function POST(request: NextRequest) {
  const body = await request.json();

  const postId = Number(body.postId);

  if (!postId) {
    return NextResponse.json(
      { error: "Invalid post id" },
      { status: 400 },
    );
  }

  // Try to get the user's IP address.
  const forwardedFor = request.headers.get("x-forwarded-for");

  const userIP =
    forwardedFor?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  // Check whether this IP already liked this post.
  const existingLike = await client.db.like.findUnique({
    where: {
      postId_userIP: {
        postId,
        userIP,
      },
    },
  });

  if (existingLike) {
    // Already liked -> unlike it.
    await client.db.like.delete({
      where: {
        postId_userIP: {
          postId,
          userIP,
        },
      },
    });
  } else {
    // Not liked yet -> create a like.
    await client.db.like.create({
      data: {
        postId,
        userIP,
      },
    });
  }

  // Count the current likes after the change.
  const likes = await client.db.like.count({
    where: {
      postId,
    },
  });

  return NextResponse.json({
    likes,
  });
}