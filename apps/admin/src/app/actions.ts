"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { client } from "@repo/db/client";
import { env } from "@repo/env/admin";
import { toUrlPath } from "@repo/utils/url";

// ---------------------------------------------------------
// ASSIGNMENT 2.3 - LOGIN WITH JWT
// ---------------------------------------------------------

export async function login(formData: FormData) {
  const password = formData.get("password");

  // Password is checked only on the server.
  if (password !== env.PASSWORD) {
    redirect("/");
  }

  // Create the same kind of JWT used by /api/auth.
  const token = jwt.sign(
    {
      role: "admin",
    },
    env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  const userCookies = await cookies();

  userCookies.set("auth_token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: false,
  });

  redirect("/");
}

// ---------------------------------------------------------
// LOGOUT
// ---------------------------------------------------------

export async function logout() {
  const userCookies = await cookies();

  userCookies.delete("auth_token");

  // Keep this for the old Assignment 2 E2E fixture.
  userCookies.delete("password");

  redirect("/");
}

// ---------------------------------------------------------
// TOGGLE ACTIVE / INACTIVE
// ---------------------------------------------------------

export async function togglePostActive(postId: number) {
  const post = await client.db.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    return;
  }

  await client.db.post.update({
    where: {
      id: postId,
    },
    data: {
      active: !post.active,
    },
  });

  revalidatePath("/");
}

// ---------------------------------------------------------
// UPDATE POST
// ---------------------------------------------------------

export async function updatePost(
  postId: number,
  data: {
    title: string;
    category: string;
    description: string;
    content: string;
    imageUrl: string;
    tags: string;
  },
) {
  await client.db.post.update({
    where: {
      id: postId,
    },
    data: {
      title: data.title,
      category: data.category,
      description: data.description,
      content: data.content,
      imageUrl: data.imageUrl,

      tags: data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
        .join(","),
    },
  });

  revalidatePath("/");
}

// ---------------------------------------------------------
// CREATE POST
// ---------------------------------------------------------

export async function createPost(data: {
  title: string;
  category: string;
  description: string;
  content: string;
  imageUrl: string;
  tags: string;
}) {
  const urlId = toUrlPath(data.title);

  await client.db.post.create({
    data: {
      title: data.title,
      category: data.category,
      description: data.description,
      content: data.content,
      imageUrl: data.imageUrl,

      tags: data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
        .join(","),

      urlId,
      active: true,
      views: 0,
    },
  });

  revalidatePath("/");

  return urlId;
}