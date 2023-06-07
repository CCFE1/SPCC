import { Input, Label } from "@ui/index";
import type { InputProps, LabelProps } from "@models/interfaces";
import styles from "./FormGroup.module.css";

export default function FormGroup(props: FormGroupProps) {
  return (
    <div className={styles.formGroup} style={props.styles}>
      {props.label && <Label {...props.label} />}

      <Input {...props.input} />
    </div>
  );
}

interface FormGroupProps {
  label?: LabelProps;
  input: InputProps;
  styles?: any;
}
