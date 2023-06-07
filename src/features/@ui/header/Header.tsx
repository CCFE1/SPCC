import styles from "./Header.module.css";
import { HamburgerMenu } from "@ui/index";

export default function Header() {
  return (
    <header className={styles.header}>
      <HamburgerMenu />
      <span className={styles.logo}>
        UV
      </span>
    </header>
  );
}
