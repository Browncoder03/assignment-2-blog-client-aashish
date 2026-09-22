import { defineConfig, devices } from "@playwright/test";
import "dotenv/config";

import fs from "fs";
import path from "path";

// Authentication setup files are stored here.
const authDir = path.resolve(".auth");

// Create the authentication directory when it does not exist.
if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir);
  console.log(".auth directory created");
}

export default defineConfig({
  testDir: "./tests",

  // Run tests in a predictable order because they share
  // the same local test database.
  fullyParallel: false,
  workers: 1,

  // Prevent accidental test.only usage in the CI pipeline.
  forbidOnly: !!process.env.CI,

  // Retry failed tests only inside CI.
  retries: process.env.CI ? 2 : 0,

  // Stop individual tests from waiting forever.
  timeout: 30_000,

  reporter: [["list"]],

  use: {
    trace: "on-first-retry",
    testIdAttribute: "data-test-id",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },

    {
      // Give the admin and web projects different names
      // so they can be executed separately.
      name: "admin-chromium",
      testDir: "./tests/admin",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3002",
      },
      dependencies: process.env.CI ? ["setup"] : [],
    },

    {
      name: "web-chromium",
      testDir: "./tests/web",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3001",
      },
      dependencies: process.env.CI ? ["setup"] : [],
    },
  ],

  // In CI, start the production builds automatically.
  // During local development, the user runs turbo dev separately.
  webServer: process.env.CI
    ? [
        {
          command: "pnpm start:admin",
          url: "http://localhost:3002",
          reuseExistingServer: true,
        },
        {
          command: "pnpm start:web",
          url: "http://localhost:3001",
          reuseExistingServer: true,
        },
      ]
    : undefined,
});