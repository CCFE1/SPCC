import { useRef, useEffect, useState } from "react";
import style from "./Button.module.css";

import type { MouseElementFunction } from "@models/types";
import type { ButtonProps } from "@models/interfaces";

export default function Button(props: ButtonProps) {
  const ref = useRef<any>(null);
  const [styles, setStyles] = useState<any>({});

  useEffect(() => {
    if (!!ref) {
      setStyles({
        maxHeight: ref.current.offsetHeight,
      });
    }
  }, [ref]);

  return (
    <button
      ref={ref}
      type={props.type ? props.type : "button"}
      className={style.btn}
      onClick={props.onClick}
      disabled={props.disabled}
      style={{ ...props.style, ...styles }}
    >
      {props.text}
    </button>
  );
}
