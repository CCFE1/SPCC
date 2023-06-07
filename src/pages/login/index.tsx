import { useEffect } from "react";
import styles from "./Login.module.css";
import { useRouter } from "next/router";
import { LoginFeature } from "@users/index";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    const token: string | null = localStorage.getItem("token");
    if (token) {
      router.replace("/main");
    }
  }, []);

  return (
    <>
      <main
        className={styles.login}
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/login.jpg')`,
        }}
      >
        <LoginFeature />
      </main>
    </>
  );
}