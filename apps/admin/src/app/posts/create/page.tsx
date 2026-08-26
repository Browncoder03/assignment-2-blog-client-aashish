

import { redirect } from "next/navigation";

import { PostForm } from "../../../components/PostForm";
import { isLoggedIn } from "../../../utils/auth";

export default async function Page() {
  // Assignment 2:
  // only logged-in users can access the create page.
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      {/* No post is passed, so this becomes an empty create form */}
      <PostForm />
    </main>
  );
}