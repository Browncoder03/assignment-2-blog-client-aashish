import { test as setup } from "@playwright/test";
import fs from "fs";

// ---------------------------------------------------------
// ASSIGNMENT 2 AUTH SETUP
// ---------------------------------------------------------
//
// Kept so Assignment 2 regression tests still work.

setup(
  "authenticate assignment 2",
  { tag: "@a2" },
  async () => {
    const authFile = ".auth/user.json";

    const content = {
      cookies: [
        {
          name: "password",
          value: "123",
          domain: "localhost",
          secure: false,
          expires: -1,
          path: "/",
          httpOnly: false,
          sameSite: "Lax",
        },
      ],
    };

    fs.writeFileSync(
      authFile,
      JSON.stringify(content, null, 2),
    );
  },
);

// ---------------------------------------------------------
// ASSIGNMENT 2.3 AUTH SETUP
// ---------------------------------------------------------
//
// A3 logs in through the real backend API and stores
// the JWT auth_token cookie.

setup(
  "authenticate assignment 3",
  { tag: "@a3" },
  async ({ playwright }) => {
    const authFile = ".auth/user.json";

    const apiContext =
      await playwright.request.newContext({
        baseURL: "http://localhost:3002",
      });

    await apiContext.post("/api/auth", {
      data: {
        password: "123",
      },
    });

    await apiContext.storageState({
      path: authFile,
    });

    await apiContext.dispose();
  },
);