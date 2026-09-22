import { seed } from "@repo/db/seed";
import { NextResponse } from "next/server";

export async function GET() {
  // Never allow database resets through deployed Vercel URLs.
  if (process.env.VERCEL === "1") {
    return new Response("Not Available", { status: 501 });
  }

  // Keep this endpoint available for local and CI E2E tests.
  if (!process.env.E2E) {
    return new Response("Not Available", { status: 501 });
  }

  await seed();

  return NextResponse.json(
    { message: "Seeded" },
    { status: 200 },
  );
}