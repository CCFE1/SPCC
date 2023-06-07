import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { Field } from "react-final-form";

const SwitchAdapter = ({ input, ...rest }: any) => {
  return (
    <FormControlLabel
      labelPlacement="start"
      control={<Switch {...input} {...rest} />}
      label="¿Eliminar horarios anteriores?"
    />
  );
};

export default function SwitchInput() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <Field name="borrar" type="checkbox" component={SwitchAdapter} />
    </div>
  );
}
