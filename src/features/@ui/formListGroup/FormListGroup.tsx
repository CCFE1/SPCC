import { ListInput, Label } from "@ui/index";
import type { FormListGroupProps } from "@models/interfaces";

export default function FormListGroup(props: FormListGroupProps) {
  return (
    <div
      style={{
        display: "flex",
        flexFlow: "column",
        padding: ".5rem .2rem",
        ...props.styles,
      }}
    >
      {props.label && <Label {...props.label} />}

      <ListInput {...props.listInput} />
    </div>
  );
}
