import styles from "./InputLoading.module.css";
import type { InputLoadingProps } from "@models/interfaces";

export default function InputLoading(props: InputLoadingProps) {
  return (
    <div
      className={styles.mainItem}
      style={props.width ? { width: props.width } : undefined}
    >
      <div
        className={styles.staticBackground}
        style={{ height: props.height }}
      ></div>
    </div>
  );
}
