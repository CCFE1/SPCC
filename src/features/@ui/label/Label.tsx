import type { LabelProps } from "@models/interfaces";
import { forwardRef } from "react";

const Label = forwardRef<HTMLSpanElement, LabelProps>((props, ref) => {
  const { text, size = "16px", className, styles, ...other } = props;

  return (
    <span
      ref={ref}
      className={className}
      style={{
        fontSize: size,
        ...styles,
      }}
      {...other}
    >
      {text}
    </span>
  );
});

Label.displayName = "Label";

export default Label;
