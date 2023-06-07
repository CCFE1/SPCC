import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@store/hooks";
import type { DateSelectorProps } from "@models/interfaces";
import { DatePicker } from "@ui/index";
import { selectDate, setDate } from "@courses/courseSlice";
import { clearAction } from "@courses/nrc-selector/NrcSelectorHelper";

import {
  addDays,
  areSameDates,
  getDateISOFormat,
  getDateFromISOFormat,
} from "@utils/index";

export default function DateSelector(props: DateSelectorProps) {
  const dispatch = useAppDispatch();
  const date: Date = useAppSelector(selectDate);

  const [minDate] = useState<Date>(getDateFromISOFormat());
  const [maxDate] = useState<Date>(addDays(minDate, 7));
  const [lastDate, setLastDate] = useState<Date>(date);
  useEffect(() => {
    if (areSameDates(lastDate, date)) return;
    // Limpiar inputs y setear una nueva fecha como última fecha
    setLastDate(date);
    clearAction(props.setValue);
  }, [date]);

  const onChangeCustom = (newValue: Date) => {
    const date = getDateISOFormat(newValue);
    dispatch(setDate(date));
  };

  return (
    <DatePicker
      date={date}
      minDate={minDate}
      maxDate={maxDate}
      onChangeCustom={onChangeCustom}
    />
  );
}
