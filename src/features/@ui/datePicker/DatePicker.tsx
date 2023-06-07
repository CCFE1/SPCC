import { Field } from "react-final-form";
import DatePicker from "react-datepicker";

import type { DatePickerAdapterProps } from "@models/types";
import type { LabelDatePickerProps } from "@models/interfaces";

import styles from "./DatePicker.module.css";
import "react-datepicker/dist/react-datepicker.css";

function DatePickerAdapter({
  input: { onChange, value },
  meta: { error, touched },
  onChangeCustom,
  ...rest
}: DatePickerAdapterProps) {
  const onChangeCustomized = (newValue: Date) => {
    if (!!onChangeCustom) {
      onChangeCustom(newValue);
    }

    onChange(newValue);
  };

  return (
    <DatePicker
      selected={value}
      dateFormat="dd/MM/yyyy"
      onChange={onChangeCustomized}
      className={styles.custom}
      {...rest}
    />
  );
}

export default function LabelDatepicker(props: LabelDatePickerProps) {
  return (
    <Field
      name="fecha"
      minDate={props.minDate}
      maxDate={props.maxDate}
      disabled={props.disabled}
      initialValue={props.date}
      component={(fieldProps) => (
        <DatePickerAdapter
          {...fieldProps}
          onChangeCustom={props.onChangeCustom}
        />
      )}
    />
  );
}
