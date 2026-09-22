import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const packageDirectory = fileURLToPath(new URL("../", import.meta.url));

// Local development uses SQLite.
// Set DEPLOY_DATABASE=postgresql in Vercel to use Neon.
const provider = process.env.DEPLOY_DATABASE || "sqlite";

if (!["sqlite", "postgresql"].includes(provider)) {
  throw new Error("DEPLOY_DATABASE must be sqlite or postgresql.");
}

const schema =
  provider === "postgresql"
    ? "prisma/schema.postgresql.prisma"
    : "prisma/schema.prisma";

console.log(`Generating Prisma Client for ${provider}`);

const result = spawnSync(
  process.execPath,
  [require.resolve("prisma/build/index.js"), "generate", "--schema", schema],
  {
    cwd: packageDirectory,
    env: process.env,
    stdio: "inherit",
  },
);

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);