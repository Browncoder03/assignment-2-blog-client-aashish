import { posts } from "@repo/db/data";

import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";

import styles from "./page.module.css";

export default function Home() {
  // Only show posts that are active
  const activePosts = posts.filter((post) => post.active);

  return (
    <AppLayout>
      <Main posts={activePosts} className={styles.main} />
    </AppLayout>
  );
}