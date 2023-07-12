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
        <div className="f-center">
          <span
            style={{
              textAlign: "center",
              fontSize: "1.8rem",
              weight: "bold",
              lineHeight: "2.2rem",
              color: "var(--white)",
            }}
          >
            Sistema de Prestamos del <br /> Centro de Cómputo
          </span>
        </div>
        <LoginFeature />
      </main>
    </>
  );
}
