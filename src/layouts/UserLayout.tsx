import { Header } from "@ui/index";
import styles from "./UserLayout.module.css";
import type { UserLayoutProps } from "@models/interfaces";

// This layout contains a header with not admin options
export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className={styles.layout}>
      <Header />
      <main>{children}</main>
    </div>
  );
}
