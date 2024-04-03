import Image from "next/image";
import styles from "./page.module.css";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = cookies();
  const cookie = cookieStore.get("_WcaOnRails_session");
  console.log(cookie?.value);

  const res = await fetch("http://localhost:3000/api/v0/users/me", {
    headers: {
      "Content-Type": "application/json",
      ...(cookie && {
        Cookie: `_WcaOnRails_session=${encodeURIComponent(cookie.value || "")}`,
      }),
    },
  });

  const { user, error } = (await res.json()) || {};
  console.log(20, { user, error });

  return (
    <main className={styles.main}>
      {user ? (
        <div>
          <h1 className={styles.title}>Hello, {user.name}!</h1>
          <Image
            src={user.avatar.url || ""}
            alt="avatar"
            width={200}
            height={200}
            className={styles.avatar}
          />
        </div>
      ) : (
        <h1 className={styles.title}>Hello, World!</h1>
      )}
    </main>
  );
}
