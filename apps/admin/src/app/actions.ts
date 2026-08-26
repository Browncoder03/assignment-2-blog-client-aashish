"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Assignment 2 uses a hard-coded password.
// We are not using database authentication or JWT.
const ADMIN_PASSWORD = "123";

export async function login(formData: FormData) {
  // Get the password entered into the login form.
  const password = formData.get("password");

  // Only allow the Assignment 2 hard-coded password.
  if (password !== ADMIN_PASSWORD) {
    // For now simply return to the login page.
    // Later we can add a visible validation message if a test requires it.
    redirect("/");
  }

  const userCookies = await cookies();

  // Create the cookie required by Assignment 2.
  userCookies.set("auth_token", "logged-in", {
    // JavaScript running in the browser cannot access this cookie.
    httpOnly: true,

    // Cookie is available throughout the admin application.
    path: "/",

    // Suitable for local development and normal navigation.
    sameSite: "lax",

    // localhost uses HTTP during development,
    // therefore secure must remain false here.
    secure: false,
  });

  // Reload the home page after successful login.
  redirect("/");
}

export async function logout() {
  const userCookies = await cookies();

  // Remove the normal Assignment 2 authentication cookie.
  userCookies.delete("auth_token");

  // The official Playwright userPage fixture may contain
  // this starter authentication cookie as well.
  userCookies.delete("password");

  // Return to the login screen.
  redirect("/");
}