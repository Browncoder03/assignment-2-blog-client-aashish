# Full Stack Blog — Assignment 2

A blogging application with a public website, an admin dashboard, and a SQLite database.

The project includes the functionality for Assignments 2.1, 2.2, and 2.3, together with pagination, a rich-text editor, and threaded comments.

## Verification status

The complete Playwright suite passed locally:

**46 tests passed in 51.5 seconds.**

The passing run used:

- Node.js 22.23.2
- pnpm 10.2.0
- Playwright 1.50.0
- Production builds of the web and admin applications
- One worker, with retries disabled

This includes the original assignment tests and the added pagination, rich-text editor, and Discussion Corner tests.

Production builds also completed successfully. This result refers to the Playwright suite; it does not claim that every separate unit test, lint check, or deployment check has been completed.

The requirement checkboxes below are retained for manual review. A passing automated suite does not verify every manual requirement.

## Features added for this project

### Blog pagination

The public blog displays three posts per page by default.

- Numbered links and Previous/Next links navigate between pages.
- The current page is stored in the URL.
- Existing query parameters are preserved during navigation.
- Pagination is available in the home, search, category, tag, and history views.
- Pagination controls are hidden when there is only one page.
- The total post count represents all matching posts, not just the current page.

### Rich-text post editor

The admin form offers a visual editor built with Tiptap alongside the Markdown editor.

The visual editor supports:

- Bold and italic text
- Heading levels 2 and 3
- Bullet and numbered lists
- Quotes and code blocks
- Undo and redo

Content is saved as Markdown. A saved post can be reopened for editing and displayed on the public blog.

The rich-text Playwright test checks that bold formatting survives saving, reopening, and viewing the post on the public website.

### Discussion Corner

Readers can add comments and reply to other comments.

- Comments and replies are stored in SQLite through Prisma.
- Each reply references its parent comment.
- Replies can be collapsed and expanded.
- Initial avatars are generated from readers' display names.
- The form shows the comment being replied to.
- Readers can cancel a reply.
- The interface displays character counts, save feedback, and errors.
- A failed submission keeps the reader's draft.

The server validates the display name, comment length, post availability, and parent comment. A reply must belong to the same post as its parent.

Comments are displayed as plain text. Display names are reader-entered and are not verified accounts.

The discussion test checks comment creation, replies, persistence after refreshing, and collapsing or expanding a thread.

### Responsive navigation

The layout adjusts to the available browser width.

- Large windows display a full sidebar beside the content.
- Windows from 640px wide display a smaller sidebar beside the content.
- Narrower windows display a collapsible Browse topics menu.

The navigation is rendered once. This avoids duplicate links in the page and keeps the original Playwright selectors working.

## Prerequisites

Use the versions that passed the local test run:

- Node.js 22.23.2
- pnpm 10.2.0

The root package.json specifies pnpm 10.2.0.

If Node.js 22.23.2 is already installed through NVM for Windows, select it with:

```powershell
nvm use 22.23.2
node --version
```

During troubleshooting, an older test stalled during discovery under Node.js 24.13.0. Switching to Node.js 22.23.2 resolved that observed discovery problem.

Turbo is included in the project dependencies. A separate global Turbo installation is not required for the commands below.

## Environment setup

Create the following local files from the supplied examples if they do not already exist:

| Example file | Local file |
| --- | --- |
| packages/db/.env.example | packages/db/.env |
| apps/admin/.env.example | apps/admin/.env.local |

The database environment uses:

```dotenv
DATABASE_URL="file:./dev.db"
```

The admin application requires PASSWORD and JWT_SECRET.

The supplied authentication tests use password `123`. This is a local test value. Use appropriate secrets for a deployed environment and do not commit local environment files.

## Installing the project

Run from the repository root:

```powershell
pnpm install --frozen-lockfile
pnpm --filter @repo/db db:push
pnpm --filter @repo/db build
```

The database command creates or updates tables from the Prisma schema. It does not populate the starter posts.

Install the browser used by the configured Playwright projects:

```powershell
cd tests\playwright
pnpm exec playwright install chromium
```

## Running the applications

From the repository root:

```powershell
pnpm turbo dev --ui=tui
```

The applications run at:

- Public blog: http://localhost:3001
- Admin dashboard: http://localhost:3002

Keep this terminal running while using the development applications.

## Building for production

Stop running development servers before building, particularly on Windows where Prisma's engine file can remain locked by a running process.

From the repository root:

```powershell
pnpm build
```

Wait for the final successful task summary and for the terminal prompt to return. Next.js printing "Compiled successfully" is an intermediate step, not the end of the build.

If the Node.js version has changed or a stale cached build needs to be ruled out, rebuild without using Turbo's cache:

```powershell
pnpm exec turbo build --force
```

## Running the complete Playwright suite

With `pnpm dev` running in another terminal, run from the repository root:

```powershell
pnpm test
```

This runs every Playwright test, including pagination, rich-text editor, and
Discussion Corner, without filtering by assignment tags. New `*.spec.ts` files
under `tests/playwright/tests/admin` or `tests/playwright/tests/web` are included
automatically. Authentication setup runs first locally and in CI.

Use `pnpm test:ui` for the full suite in Playwright UI, or `pnpm test --list`
to check discovery without executing tests. These commands cover the end-to-end
suite; the separate Vitest unit tests keep their existing package commands.

### Protect existing local data

Some original tests call seed(), which deletes existing posts and likes and recreates the starter data. Deleting posts also removes their comments.

Back up the database before running the suite if it contains posts or discussions you want to keep.

With the applications stopped, run this from the repository root to copy the current SQLite database to a timestamped file in the Windows temporary folder:

```powershell
$backupPath = Join-Path $env:TEMP ("blog-backup-" + (Get-Date -Format "yyyyMMdd-HHmmss") + ".db")
Copy-Item .\packages\db\prisma\dev.db $backupPath -ErrorAction Stop
Write-Output "Database backup: $backupPath"
```

Keep the printed path. Do not proceed if the backup fails and you need to preserve the existing data.

### Run against production builds

First, build the applications from the repository root:

```powershell
pnpm build
```

After the build finishes successfully:

```powershell
cd tests\playwright
$env:CI = "true"
pnpm exec playwright test --reporter=list --max-failures=1 --retries=0
```

These commands are for Windows PowerShell.

With CI=true, the Playwright configuration starts the production web and admin applications and runs the authentication setup dependencies. Do not start turbo dev alongside this run.

The command stops after the first failure and disables retries, making failures easier to investigate.

After testing, remove the temporary CI setting before returning to normal development:

```powershell
Remove-Item Env:CI -ErrorAction SilentlyContinue
```

### List tests without running them

From tests/playwright:

```powershell
pnpm exec playwright test --list
```

This lists the tests without executing their database-reset hooks.

### Run an individual added test

With production builds available and CI=true, run one of these commands from tests/playwright:

```powershell
pnpm exec playwright test tests/web/pagination.spec.ts --project=web-chromium --reporter=list
```

```powershell
pnpm exec playwright test tests/admin/rich-text-editor.spec.ts --project=admin-chromium --reporter=list
```

```powershell
pnpm exec playwright test tests/web/discussion.spec.ts --project=web-chromium --reporter=list
```

The rich-text test creates a post. The discussion test creates a comment and reply. These focused tests leave their created records in the local database; subsequent seed-based tests can remove them.

### Playwright UI

For interactive development, start the development applications separately.

In the test terminal, remove CI mode and start the Playwright UI:

```powershell
Remove-Item Env:CI -ErrorAction SilentlyContinue
pnpm exec playwright test --ui
```

## Project structure

### Applications

- apps/web — Public blog website
- apps/admin — Admin dashboard

### Shared packages

- packages/db — Prisma schema, database client, starter data, and seed function
- packages/env — Environment variable validation
- packages/ui — Shared UI styles and components
- packages/utils — Shared utility functions
- packages/eslint-config — Shared lint configuration
- packages/tailwind-config — Shared styling configuration
- packages/typescript-config — Shared TypeScript configuration

### Tests

- tests/playwright/tests/admin — Admin end-to-end tests
- tests/playwright/tests/web — Public blog end-to-end tests
- tests/playwright/tests/auth.setup.ts — Authentication setup
- tests/playwright/playwright.config.ts — Playwright configuration
- tests/storybook — Storybook configuration and component development

## Success criteria

- All required tests must pass.
- The student must be able to explain the code in the codebase.

## Requirements — Assignment 2.1: Client

### Home screen

- [ ] Show only active posts.
- [ ] Show categories linking to posts in the selected category.
- [ ] Show tags linking to posts with the selected tag.
- [ ] Show history links by month and year.
- [ ] Generate tags and history items from active posts.
- [ ] Display each post's title linked to its detail page, description, date, image, tags, likes, and views.
- [ ] Support light and dark themes through a button, storing the theme in the data-theme attribute on the HTML element.
- [ ] Search post titles and descriptions and navigate to the search page.

### Detail screen

- [ ] Display the list-item information, replacing the short description with formatted full content.
- [ ] Convert Markdown content into HTML.

### Category screen

- [ ] Display posts belonging to the category in the URL.
- [ ] Display "0 Posts" when no posts match.

### History screen

- [ ] Display posts from the year and month in the URL.
- [ ] Display "0 Posts" when no posts match.

### Tag screen

- [ ] Display posts matching the tag in the URL.
- [ ] Display "0 Posts" when no posts match.

### Search screen

- [ ] Display results based on the q query parameter.
- [ ] Display "0 Posts" when no posts match.

## Requirements — Assignment 2.2: Admin

### Admin home screen

- [ ] Display the login screen when logged out.
- [ ] Display the post list when logged in.
- [ ] Provide a logout button.
- [ ] Log the user out when the button is clicked.
- [ ] Authenticate using the assignment password.
- [ ] Remember the session using an HTTP-only cookie named auth_token.

### Admin list screen

- [ ] Show active and inactive posts.
- [ ] Restrict access to logged-in users.
- [ ] Filter by title or content.
- [ ] Filter by tags.
- [ ] Filter by date.
- [ ] Filter by visibility.
- [ ] Support combining filters.
- [ ] Sort by title or creation date in ascending and descending order.
- [ ] Display each post's image and title.
- [ ] Display category, tags, and active status.
- [ ] Provide an active-status button with feedback.
- [ ] Open the update screen when a post title is clicked.
- [ ] Provide a Create Post control.
- [ ] Open the create screen from that control.

### Admin create and update screens

Both screens use the same form. The update screen preloads the existing post.

- [ ] Restrict access to logged-in users.
- [ ] Validate the title.
- [ ] Validate the description, with a maximum of 200 characters.
- [ ] Validate Markdown content.
- [ ] Validate the comma-separated tag list.
- [ ] Validate the image URL.
- [ ] Provide Preview and Close Preview controls for Markdown.
- [ ] Restore the cursor position when closing the preview.
- [ ] Display an image preview below the image URL field.
- [ ] Display validation errors when Save is clicked with invalid or missing values.

## Requirements — Assignment 2.3: Backend

### Public blog

- [ ] Load data from the database.
- [ ] Filter data on the server and send only filtered post results to the client.
- [ ] Increase the view count when a post detail page is visited.
- [ ] Allow liking from the detail page rather than the list.
- [ ] Increase the like count when a post is liked.
- [ ] Allow one like per IP address per post.
- [ ] Allow unliking and decrease the count.

### Admin authentication

These requirements also need manual review.

- [ ] Check the password on the server through /api/auth.
- [ ] Use POST for login.
- [ ] Use DELETE for logout.
- [ ] Verify the JWT before displaying protected admin content.
- [ ] Display the login screen when the token is missing or invalid.

### Admin post management

- [ ] Save active/inactive status changes to the database.
- [ ] Allow an authenticated user to update a validated post.
- [ ] Allow an authenticated user to create a validated post.

## Troubleshooting

### Playwright is not recognised

Run pnpm exec playwright commands from tests/playwright, where the dependency is installed.

### Prisma reports EPERM on Windows

Stop the development servers and Prisma Studio before generating Prisma Client or building. A running process may hold the Prisma engine file open.

### Production build is missing

Run pnpm build and wait for it to finish before starting production servers.

### Test discovery hangs

Check node --version. Node.js 22.23.2 was used for the successful 46-test run.

### Hydration warnings containing bis_skin_checked

The observed warning disappeared when using Chrome Incognito without extensions. Test without browser extensions before changing application code.

## Remaining verification

The recorded passing result is local. GitHub Actions execution, deployment, and any separate unit-test or lint results must be verified independently before claiming they pass.
