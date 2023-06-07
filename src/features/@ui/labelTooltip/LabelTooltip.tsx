import { forwardRef, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { Label } from "@ui/index";

import type { LabelTooltipProps, LabelProps } from "@models/interfaces";

export default function LabelTooltip(props: LabelTooltipProps) {
  const [dots] = useState(props.text.length > props.visibleWords ? "..." : "");
  const CustomComponent = forwardRef<HTMLSpanElement, LabelProps>(
    function MyComponent(props, ref) {
      return <Label ref={ref} {...props} />;
    }
  );

  return (
    <Tooltip title={props.text} placement="top-start" arrow disableInteractive>
      <CustomComponent
        styles={props.styles}
        text={
          !!props.text ? props.text.slice(0, props.visibleWords) + dots : ""
        }
      />
    </Tooltip>
  );
}
