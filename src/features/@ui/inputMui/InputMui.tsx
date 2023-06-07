import { Field } from "react-final-form";
import TextField from "@mui/material/TextField";
import type { InputMuiProps } from "@models/interfaces";

function InputAdapter({ input, meta: { error, touched }, ...rest }: any) {
  return (
    <TextField
      {...input}
      {...rest}
      variant="outlined"
      size="small"
      error={touched && !!error}
      helperText={touched && error}
    />
  );
}

export default function InputMui(props: InputMuiProps) {
  return (
    <div>
      <Field
        name={props.name}
        type={props.type}
        disabled={props.disabled}
        label={props.label}
        margin={props.margin ? props.margin : "normal"}
        autoComplete={!props.autocomplete ? "on" : props.autocomplete}
        component={InputAdapter}
      />
    </div>
  );
}
