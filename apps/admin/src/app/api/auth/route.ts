import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { env } from "@repo/env/admin";

// ---------------------------------------------------------
// ASSIGNMENT 2.3 AUTH API
// ---------------------------------------------------------

export async function POST(request: Request) {
  const body = (await request.json()) as {
    password?: string;
  };

  // Check password on the SERVER.
  if (body.password !== env.PASSWORD) {
    return NextResponse.json(
      {
        error: "Invalid password",
      },
      {
        status: 401,
      },
    );
  }

  // Create a signed JWT.
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

  // Store JWT in a httpOnly cookie.
  userCookies.set("auth_token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",

    // localhost uses HTTP.
    secure: false,
  });

  return NextResponse.json({
    success: true,
  });
}

// ---------------------------------------------------------
// LOGOUT
// ---------------------------------------------------------

export async function DELETE() {
  const userCookies = await cookies();

  userCookies.delete("auth_token");

  return NextResponse.json({
    success: true,
  });
}