import { useEffect, useMemo, useState } from "react";
import { Label, ListInput } from "@ui/index";
import { getDecimalHour, addHoursToHour } from "@utils/index";
import { SelectorProps } from "@models/interfaces";
import { Dayjs } from "dayjs";

import styles from "./HoursSelector.module.css";
import HoursSelectorModal from "./HoursSelectorModal/HoursSelectorModal";

import {
  getInitialHoursList,
  getLastHoursList,
  ValueList,
} from "./HoursSelectorHelper";

export default function HoursSelector(props: SelectorProps) {
  const [inputSelected, setInputSelected] = useState<"horaInicio" | "horaFin">(
    "horaInicio"
  );
  const [actualHour] = useState<number>(getDecimalHour());
  const [isOtherSelected, setIsOtherSelected] = useState<boolean>(false);

  const handleCloseTimePicker = () => {
    setIsOtherSelected(false);
  };

  // Setear la lista inicial del input hora inicio
  const [initialHoursList, setInitialHoursList] = useState<ValueList[]>([]);
  useEffect(() => {
    if (!initialHoursList.length) {
      const initList = getInitialHoursList(actualHour);
      setInitialHoursList(initList);
    }
  }, [initialHoursList]);

  // Setear la lista inicial del input de hora fin.
  const [lastHoursList, setLastHoursList] = useState<ValueList[]>([]);
  useEffect(() => {
    if (!lastHoursList.length) {
      const initList = getLastHoursList(actualHour);
      setLastHoursList(initList);
    }
  }, [lastHoursList]);

  // En caso de haber un valor inicial, se crea una función
  // estática para enviar el valor en su respectivo objeto.
  const { initialValue } = props;
  const defaultValueHoraInicio: any = useMemo(() => {
    // Si no hay un initialValue, se asigna la hora actual al input inicial
    return !initialValue
      ? {
          label: `${actualHour}:00`,
          value: actualHour,
        }
      : {
          label: `${initialValue.materia.horario.horaInicio}:00`,
          value: initialValue.materia.horario.horaInicio,
        };
  }, [initialValue]);

  const defaultValueHoraFin: any = useMemo(() => {
    const finalHour: Dayjs = addHoursToHour(actualHour, 2);
    const finalHourFormated: string = finalHour.format("HH:00");
    const decimalFinalHour: number = getDecimalHour(finalHour.toDate());

    // Si no hay un initialValue, se asigna la hora actual+2horas al input final.
    return !initialValue
      ? {
          label: finalHourFormated,
          value: decimalFinalHour,
        }
      : {
          label: `${initialValue.materia.horario.horaFin}:00`,
          value: initialValue.materia.horario.horaFin,
        };
  }, [initialValue]);

  // Handler del input de hora inicio
  const onChangeInicio = (selectedItem: ValueList) => {
    if (selectedItem.value === -1) {
      setIsOtherSelected(true);
      setInputSelected("horaInicio");
      return;
    }

    props.setValue("horaInicio", selectedItem);
  };

  // Handler del input de hora fin
  const onChangeFin = (selectedItem: ValueList) => {
    if (selectedItem.value === -1) {
      setIsOtherSelected(true);
      setInputSelected("horaFin");
      return;
    }

    props.setValue("horaFin", selectedItem);
  };

  const handleCustomTimeChange = (time: any) => {
    console.log(time);
  };

  return (
    <div className={styles.formGroup}>
      <div className={`${styles.marginBottom} ${styles.f}`}>
        <Label text="Horario" />
      </div>

      <div className={styles.f}>
        {/* Hora de Inicio */}
        <div style={{ width: "5.5vw" }}>
          <ListInput
            isLoading={props.isLoading}
            name="horaInicio"
            placeholder="Inicio"
            optionList={initialHoursList}
            size={5}
            styles={{
              marginLeft: ".5rem",
            }}
            onChange={onChangeInicio}
            disabled={props.disabled}
            initialValue={defaultValueHoraInicio}
            disableClearable
            disableCreate
          />
        </div>

        {/* Hora de Fin */}
        <div style={{ width: "5.5vw" }}>
          <ListInput
            isLoading={props.isLoading}
            name="horaFin"
            placeholder="Fin"
            optionList={lastHoursList}
            size={5}
            styles={{
              marginLeft: ".7rem",
            }}
            onChange={onChangeFin}
            disabled={props.disabled}
            initialValue={defaultValueHoraFin}
            disableClearable
            disableCreate
          />
        </div>
      </div>

      <HoursSelectorModal
        open={isOtherSelected}
        handleClose={handleCloseTimePicker}
        setValue={props.setValue}
        inputName={inputSelected}
      />
    </div>
  );
}
